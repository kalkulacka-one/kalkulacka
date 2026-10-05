import type { FixUpdate, StatusUpdate, Update } from "./plan.ts";

export const IDS_PER_STATEMENT = 1000;
export const STATEMENTS_PER_TRANSACTION = 100;

/** The two Prisma calls `write` needs, so it can be tested with a fake. */
export type SqlClient<Statement> = {
  executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Statement;
  transaction: (statements: Statement[]) => Promise<number[]>;
};

export type WriteResult = { statuses: number; fixes: number };

/**
 * Status-only rows with the same status share one parameterized `id = ANY(…)` statement; the `"emailStatus" = 'unverified'` guard
 * keeps a concurrent change (e.g. an Ecomail bounce) from being overwritten.
 */
function statusStatements<Statement>(client: SqlClient<Statement>, updates: StatusUpdate[]): (() => Statement)[] {
  const idsByStatus = new Map<StatusUpdate["status"], string[]>();
  for (const update of updates) {
    const ids = idsByStatus.get(update.status) ?? [];
    ids.push(update.id);
    idsByStatus.set(update.status, ids);
  }
  const statements: (() => Statement)[] = [];
  for (const [status, ids] of idsByStatus) {
    for (let i = 0; i < ids.length; i += IDS_PER_STATEMENT) {
      const chunk = ids.slice(i, i + IDS_PER_STATEMENT);
      statements.push(
        () => client.executeRaw`
          UPDATE "Subscription" SET "emailStatus" = ${status}::"EmailStatus", "updatedAt" = now()
          WHERE "id" = ANY(${chunk}::UUID[]) AND "emailStatus" = 'unverified'`,
      );
    }
  }
  return statements;
}

/**
 * One statement per typo fix: sets the corrected email and its status, and merges `emailCorrectedFrom` into the metadata
 * server-side, keeping other keys. The row is skipped (0 rows) when its email or status changed concurrently, when its metadata
 * is not an object (nothing to merge into), or when the corrected address appeared in the same origin since planning.
 */
function fixStatement<Statement>(client: SqlClient<Statement>, { id, from, to, status }: FixUpdate): () => Statement {
  return () => client.executeRaw`
    UPDATE "Subscription" SET
      "email" = ${to},
      "metadata" = CASE
        WHEN "metadata" IS NULL OR jsonb_typeof("metadata") = 'null' THEN jsonb_build_object('emailCorrectedFrom', ${from}::TEXT)
        ELSE "metadata" || jsonb_build_object('emailCorrectedFrom', ${from}::TEXT)
      END,
      "emailStatus" = ${status}::"EmailStatus",
      "updatedAt" = now()
    WHERE "id" = ${id}::UUID AND "email" = ${from} AND "emailStatus" = 'unverified'
      AND ("metadata" IS NULL OR jsonb_typeof("metadata") IN ('null', 'object'))
      AND NOT EXISTS (SELECT 1 FROM "Subscription" AS "other" WHERE "other"."origin" = "Subscription"."origin" AND lower("other"."email") = lower(${to}))`;
}

/**
 * Writes typo fixes first, then status-only updates. Each transaction commits on its own: a failure mid-run leaves a partial
 * apply, which a re-run completes because it only reads rows that are still `unverified`. Returns the rows actually written.
 */
export async function write<Statement>(client: SqlClient<Statement>, updates: Update[], onProgress?: (written: number) => void): Promise<WriteResult> {
  const fixes = updates.filter((update): update is FixUpdate => update.kind === "fix");
  const statuses = updates.filter((update): update is StatusUpdate => update.kind === "status");
  const statements = [
    ...fixes.map((fix) => ({ kind: "fixes" as const, build: fixStatement(client, fix) })),
    ...statusStatements(client, statuses).map((build) => ({ kind: "statuses" as const, build })),
  ];

  const result: WriteResult = { statuses: 0, fixes: 0 };
  for (let i = 0; i < statements.length; i += STATEMENTS_PER_TRANSACTION) {
    const batch = statements.slice(i, i + STATEMENTS_PER_TRANSACTION);
    const counts = await client.transaction(batch.map((statement) => statement.build()));
    counts.forEach((count, index) => {
      const kind = batch[index]?.kind;
      if (kind) result[kind] += count;
    });
    onProgress?.(result.statuses + result.fixes);
  }
  return result;
}
