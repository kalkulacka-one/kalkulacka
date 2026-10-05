import type { RowUpdate } from "./sync.ts";

export const IDS_PER_STATEMENT = 1000;
export const STATEMENTS_PER_TRANSACTION = 100;

export const UPDATE_KINDS = ["unsubscribe", "bounce", "marker"] as const;
export type UpdateKind = (typeof UPDATE_KINDS)[number];

/** The riskiest change an update carries; a row that both unsubscribes and bounces counts as `unsubscribe`. */
export function kindOf(update: RowUpdate): UpdateKind {
  if (update.unsubscribedAt) return "unsubscribe";
  if (update.bounced) return "bounce";
  return "marker";
}

export function countKinds(updates: RowUpdate[]): Record<UpdateKind, number> {
  const counts: Record<UpdateKind, number> = { unsubscribe: 0, bounce: 0, marker: 0 };
  for (const update of updates) counts[kindOf(update)]++;
  return counts;
}

/**
 * Deterministic apply order that makes a `--limit` canary exercise the risky SQL: one row of each kind first, then the rest of
 * the unsubscribes, bounces and marker-only rows, each sorted by id.
 */
export function orderForApply(updates: RowUpdate[]): RowUpdate[] {
  const byKind = Object.fromEntries(UPDATE_KINDS.map((kind) => [kind, [] as RowUpdate[]])) as Record<UpdateKind, RowUpdate[]>;
  for (const update of updates) byKind[kindOf(update)].push(update);
  for (const kind of UPDATE_KINDS) byKind[kind].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const heads = UPDATE_KINDS.flatMap((kind) => byKind[kind].slice(0, 1));
  return [...heads, ...UPDATE_KINDS.flatMap((kind) => byKind[kind].slice(1))];
}

/** The two Prisma calls `write` needs, so it can be tested with a fake. */
export type SqlClient<Statement> = {
  executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Statement;
  transaction: (statements: Statement[]) => Promise<number[]>;
};

/**
 * Rows needing the same change share one `id = ANY(…)` statement, so the first-run marking of every row (one shared marker)
 * collapses into a handful of statements. Each transaction commits on its own: a failure mid-run leaves a partial apply,
 * which a re-run completes. Every statement is also restricted to `origins`, so even a planning bug cannot touch rows of origins
 * that do not belong to the list.
 */
export async function write<Statement>(client: SqlClient<Statement>, updates: RowUpdate[], origins: string[], onProgress?: (written: number) => void): Promise<number> {
  const groups = new Map<string, { update: RowUpdate; ids: string[] }>();
  for (const update of updates) {
    const key = `${update.ecomail ? 1 : 0}|${update.bounced ? 1 : 0}|${update.unsubscribedAt?.toISOString() ?? ""}`;
    const group = groups.get(key) ?? { update, ids: [] };
    group.ids.push(update.id);
    groups.set(key, group);
  }

  const statements: (() => Statement)[] = [];
  for (const { update, ids } of groups.values()) {
    const marker = update.ecomail ? JSON.stringify(update.ecomail) : null;
    for (let i = 0; i < ids.length; i += IDS_PER_STATEMENT) {
      const chunk = ids.slice(i, i + IDS_PER_STATEMENT);
      // The marker is merged server-side and only where it is still missing, so other metadata keys (e.g. `cities`), concurrent
      // metadata writes and an earlier `syncedAt` are never overwritten.
      statements.push(
        () => client.executeRaw`
          UPDATE "Subscription" SET
            "metadata" = CASE
              WHEN ${marker}::JSONB IS NULL THEN "metadata"
              WHEN "metadata" IS NULL OR jsonb_typeof("metadata") = 'null' THEN jsonb_build_object('ecomail', ${marker}::JSONB)
              WHEN jsonb_typeof("metadata") = 'object' AND "metadata"->'ecomail' IS NULL THEN "metadata" || jsonb_build_object('ecomail', ${marker}::JSONB)
              ELSE "metadata"
            END,
            "unsubscribedAt" = COALESCE(${update.unsubscribedAt}::TIMESTAMPTZ, "unsubscribedAt"),
            "emailStatus" = CASE WHEN ${update.bounced}::BOOL THEN 'bounced'::"EmailStatus" ELSE "emailStatus" END,
            "updatedAt" = now()
          WHERE "id" = ANY(${chunk}::UUID[]) AND "origin" = ANY(${origins}::TEXT[])`,
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
