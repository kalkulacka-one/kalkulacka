// Subscription rows → the emails to add to the Ecomail list. The query does the filtering; `planPush` groups by address.

import type { BulkSubscriber } from "./api.ts";

/** Tags only reach contacts new to Ecomail: `update_existing: false` leaves existing contacts' tags untouched. */
export const PUSH_TAG = "Synced from app";

export type PushCandidateRow = {
  id: string;
  email: string;
  origin: string;
  createdAt: Date;
  metadata: unknown;
  emailStatus: string;
  unsubscribedAt: Date | null;
};

/** One address to send; `rowIds` are all its candidate rows, which get the marker once Ecomail accepts it. */
export type PushEmail = { email: string; origin: string; createdAt: Date; rowIds: string[] };

export type PushPlan = {
  emails: PushEmail[];
  rowsByOrigin: Record<string, number>;
  emailsByOrigin: Record<string, number>;
  rows: number;
};

/**
 * Leading/trailing ASCII whitespace, as one regex source that JS and the database (RE2 on CockroachDB, ARE on Postgres) read the
 * same way. JS `trim()` and SQL `btrim()` disagree (`btrim` strips only spaces; `trim()` also tabs, newlines and Unicode
 * spaces), so the sibling check and the JS grouping both use this pattern instead: the same address is the same key on both sides.
 */
export const EMAIL_TRIM_PATTERN = "^[ \\t\\n\\v\\f\\r]+|[ \\t\\n\\v\\f\\r]+$";
const EMAIL_TRIM = new RegExp(EMAIL_TRIM_PATTERN, "g");

/** The grouping key of an address: trimmed as the SQL `regexp_replace(…, EMAIL_TRIM_PATTERN, '', 'g')`, then lowercased. */
export function normalizeEmail(email: string): string {
  return email.replace(EMAIL_TRIM, "").toLowerCase();
}

export type QueryClient = { queryRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<PushCandidateRow[]> };

/**
 * Rows of the list's origins that are valid, subscribed and not yet marked as in Ecomail, whose address (case-insensitive) has
 * no row in any origin that is unsubscribed, invalid, bounced or already marked – the last one keeps an address already in the
 * list from being sent again. Rows with non-object metadata are skipped: the marker could not be merged into them.
 */
export function fetchCandidates(client: QueryClient, origins: string[]): Promise<PushCandidateRow[]> {
  return client.queryRaw`
    SELECT s."id", s."email", s."origin", s."createdAt", s."metadata", s."emailStatus"::TEXT AS "emailStatus", s."unsubscribedAt"
    FROM "Subscription" s
    WHERE s."origin" = ANY(${origins}::TEXT[])
      AND s."emailStatus" = 'valid'
      AND s."unsubscribedAt" IS NULL
      AND (s."metadata" IS NULL OR jsonb_typeof(s."metadata") = 'null' OR (jsonb_typeof(s."metadata") = 'object' AND s."metadata"->'ecomail' IS NULL))
      AND NOT EXISTS (
        SELECT 1 FROM "Subscription" o
        WHERE lower(regexp_replace(o."email", ${EMAIL_TRIM_PATTERN}::TEXT, '', 'g')) = lower(regexp_replace(s."email", ${EMAIL_TRIM_PATTERN}::TEXT, '', 'g'))
          AND (o."unsubscribedAt" IS NOT NULL OR o."emailStatus" IN ('invalid', 'bounced') OR o."metadata"->'ecomail' IS NOT NULL)
      )
    ORDER BY s."createdAt", s."id"`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The per-row half of the query's conditions, re-checked so a query bug cannot send more than it should. */
function isCandidate(row: PushCandidateRow, origins: Set<string>): boolean {
  const unmarked = row.metadata === null || row.metadata === undefined || (isPlainObject(row.metadata) && row.metadata.ecomail === undefined);
  return origins.has(row.origin) && row.emailStatus === "valid" && row.unsubscribedAt === null && unmarked;
}

const byAge = (a: { createdAt: Date; id: string }, b: { createdAt: Date; id: string }) => a.createdAt.getTime() - b.createdAt.getTime() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** One email per address, as stored on its oldest row, oldest first – so a `--limit` canary sends the longest-waiting ones. */
export function planPush(rows: PushCandidateRow[], origins: string[]): PushPlan {
  const allowed = new Set(origins);
  const groups = new Map<string, PushCandidateRow[]>();
  const rowsByOrigin: Record<string, number> = {};
  let count = 0;
  for (const row of rows) {
    const key = normalizeEmail(row.email);
    if (!key || !isCandidate(row, allowed)) continue;
    groups.set(key, [...(groups.get(key) ?? []), row]);
    rowsByOrigin[row.origin] = (rowsByOrigin[row.origin] ?? 0) + 1;
    count++;
  }

  const emailsByOrigin: Record<string, number> = {};
  const emails: (PushEmail & { id: string })[] = [];
  for (const group of groups.values()) {
    const [oldest, ...rest] = group.sort(byAge);
    if (!oldest) continue;
    emails.push({ id: oldest.id, email: oldest.email.replace(EMAIL_TRIM, ""), origin: oldest.origin, createdAt: oldest.createdAt, rowIds: [oldest.id, ...rest.map((row) => row.id)] });
    emailsByOrigin[oldest.origin] = (emailsByOrigin[oldest.origin] ?? 0) + 1;
  }
  return { emails: emails.sort(byAge).map(({ id: _, ...email }) => email), rowsByOrigin, emailsByOrigin, rows: count };
}

/** `CREATED_AT` as the existing contacts carry it: the UTC date of the oldest row. */
export function toSubscriber(email: PushEmail): BulkSubscriber {
  return { email: email.email, custom_fields: { CREATED_AT: email.createdAt.toISOString().slice(0, 10) }, tags: [PUSH_TAG] };
}

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}
