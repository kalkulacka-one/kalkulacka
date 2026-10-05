import type { DomainCheck } from "../check-domain";
import { checkEmailSyntaxAndTypos, emailDomain } from "../check-email";

/** Mirrors the `EmailStatus` enum of `@kalkulacka-one/database`, kept local so planning stays a pure module. */
export type EmailStatus = "valid" | "invalid" | "unverified" | "bounced";

export type SubscriptionRow = { id: string; email: string; origin: string; emailStatus: EmailStatus };

export type Reason = "syntax" | "typo" | "dns-invalid" | "dns-unknown";

export type Verdict = {
  id: string;
  email: string;
  origin: string;
  domain: string | undefined;
  status: "valid" | "invalid" | "unverified";
  reason?: Reason;
  suggestion?: string;
};

export type StatusUpdate = { id: string; status: "valid" | "invalid" };

/** Distinct lowercase domains that still need a DNS check: only of `unverified` rows that pass the syntax and typo check. */
export function domainsToCheck(rows: SubscriptionRow[]): string[] {
  const domains = new Set<string>();
  for (const row of rows) {
    if (row.emailStatus !== "unverified" || !checkEmailSyntaxAndTypos(row.email).ok) continue;
    const domain = emailDomain(row.email);
    if (domain) domains.add(domain);
  }
  return [...domains].sort();
}

/** The status of one `unverified` row. A domain missing from `domainChecks` counts as `unknown`. */
export function judge(row: SubscriptionRow, domainChecks: ReadonlyMap<string, DomainCheck>): Verdict {
  const domain = emailDomain(row.email);
  const base = { id: row.id, email: row.email, origin: row.origin, domain };
  const check = checkEmailSyntaxAndTypos(row.email);
  if (!check.ok) return { ...base, status: "invalid", reason: check.reason, ...(check.suggestion ? { suggestion: check.suggestion } : {}) };
  const dns = (domain && domainChecks.get(domain)) ?? "unknown";
  if (dns === "ok") return { ...base, status: "valid" };
  if (dns === "invalid") return { ...base, status: "invalid", reason: "dns-invalid" };
  return { ...base, status: "unverified", reason: "dns-unknown" };
}

/**
 * Verdicts for every `unverified` row and the updates to write. Rows in any other status (notably `bounced`, set from Ecomail)
 * are skipped and never written; rows that stay `unverified` produce no update.
 */
export function planStatuses(rows: SubscriptionRow[], domainChecks: ReadonlyMap<string, DomainCheck>): { verdicts: Verdict[]; updates: StatusUpdate[]; skipped: number } {
  const verdicts: Verdict[] = [];
  const updates: StatusUpdate[] = [];
  let skipped = 0;
  for (const row of rows) {
    if (row.emailStatus !== "unverified") {
      skipped++;
      continue;
    }
    const verdict = judge(row, domainChecks);
    verdicts.push(verdict);
    if (verdict.status !== "unverified") updates.push({ id: verdict.id, status: verdict.status });
  }
  return { verdicts, updates, skipped };
}

/** Deterministic apply order that makes a `--limit` canary write both statuses: one `invalid` and one `valid` first, then the rest by id. */
export function orderForApply(updates: StatusUpdate[]): StatusUpdate[] {
  const byId = (a: StatusUpdate, b: StatusUpdate) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const invalid = updates.filter((update) => update.status === "invalid").sort(byId);
  const valid = updates.filter((update) => update.status === "valid").sort(byId);
  return [...invalid.slice(0, 1), ...valid.slice(0, 1), ...invalid.slice(1), ...valid.slice(1)];
}
