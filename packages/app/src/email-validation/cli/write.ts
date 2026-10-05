import type { StatusUpdate } from "./plan";

export const IDS_PER_STATEMENT = 1000;
export const STATEMENTS_PER_TRANSACTION = 100;

/** The two Prisma calls `write` needs, so it can be tested with a fake. */
export type SqlClient<Statement> = {
  executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Statement;
  transaction: (statements: Statement[]) => Promise<number[]>;
};

/**
 * Rows with the same status share one parameterized `id = ANY(…)` statement. The `"emailStatus" = 'unverified'` guard keeps a
 * concurrent change (e.g. an Ecomail bounce) from being overwritten. Each transaction commits on its own: a failure mid-run
 * leaves a partial apply, which a re-run completes because it only reads rows that are still `unverified`.
 */
export async function write<Statement>(client: SqlClient<Statement>, updates: StatusUpdate[], onProgress?: (written: number) => void): Promise<number> {
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

  let written = 0;
  for (let i = 0; i < statements.length; i += STATEMENTS_PER_TRANSACTION) {
    const counts = await client.transaction(statements.slice(i, i + STATEMENTS_PER_TRANSACTION).map((statement) => statement()));
    written += counts.reduce((sum, count) => sum + count, 0);
    onProgress?.(written);
  }
  return written;
}
