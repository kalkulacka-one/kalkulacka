import type { DomainCheck } from "../email-validation/check-domain.ts";
import { checkEmailSyntaxAndTypos, emailDomain } from "../email-validation/check-email.ts";

/** Mirrors the `EmailStatus` enum of `@kalkulacka-one/database`, kept local so planning stays a pure module. */
export type EmailStatus = "valid" | "invalid" | "unverified" | "bounced";

export type SubscriptionRow = { id: string; email: string; origin: string; emailStatus: EmailStatus };

/** Why a row is `invalid`. Reported only, never stored. */
export type Reason = "syntax" | "typo" | "dns";
export const REASONS: readonly Reason[] = ["syntax", "typo", "dns"];

export type Verdict = {
  id: string;
  email: string;
  origin: string;
  domain: string | undefined;
  status: "valid" | "invalid" | "unverified";
  /** Set for `invalid` rows only. */
  reason?: Reason;
  /** Suggested correction: from a syntax or typo check, or from a look-alike warning. */
  suggestion?: string;
  /** The look-alike heuristic fired; DNS still decided the status. */
  suspect?: boolean;
};

export type StatusUpdate = { id: string; status: "valid" | "invalid" };

/** Distinct lowercase domains that need a DNS check: of `unverified` rows with valid syntax and no typo-map domain. Suspects are checked too. */
export function domainsToCheck(rows: SubscriptionRow[]): string[] {
  const domains = new Set<string>();
  for (const row of rows) {
    if (row.emailStatus !== "unverified" || !checkEmailSyntaxAndTypos(row.email).ok) continue;
    const domain = emailDomain(row.email);
    if (domain) domains.add(domain);
  }
  return [...domains].sort();
}

/**
 * The status of one `unverified` row:
 * - bad syntax → `invalid` (`syntax`); a domain from the typo map → `invalid` (`typo`), without DNS;
 * - otherwise DNS decides: `ok` → `valid`, `invalid` → `invalid` (`dns`), `unknown` or not checked → stays `unverified`.
 * A look-alike warning (fuzzy match, typo TLD) only marks the row as a suspect.
 */
export function judge(row: SubscriptionRow, domainChecks: ReadonlyMap<string, DomainCheck>): Verdict {
  const domain = emailDomain(row.email);
  const base = { id: row.id, email: row.email, origin: row.origin, domain };
  const check = checkEmailSyntaxAndTypos(row.email);
  if (!check.ok) return { ...base, status: "invalid", reason: check.reason, ...(check.suggestion ? { suggestion: check.suggestion } : {}) };
  const suspect = check.suspect ? { suggestion: check.suspect, suspect: true } : {};
  const dns = (domain && domainChecks.get(domain)) ?? "unknown";
  if (dns === "ok") return { ...base, status: "valid", ...suspect };
  if (dns === "invalid") return { ...base, status: "invalid", reason: "dns", ...suspect };
  return { ...base, status: "unverified", ...suspect };
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
