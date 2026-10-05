import type { DomainCheck } from "../email-validation/check-domain.ts";
import { checkEmailSyntaxAndTypos, correctTypoDomain, emailDomain } from "../email-validation/check-email.ts";

/** Mirrors the `EmailStatus` enum of `@kalkulacka-one/database`, kept local so planning stays a pure module. */
export type EmailStatus = "valid" | "invalid" | "unverified" | "bounced";

export type SubscriptionRow = { id: string; email: string; origin: string; emailStatus: EmailStatus; createdAt: Date };

/** Any Subscription row (whatever its status) whose email may collide with a typo fix. */
export type ExistingEmail = { origin: string; email: string };

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
  /** `--fix-typos`: the email is rewritten to `fix`; `status` is that of the corrected domain. */
  fix?: string;
  /** `--fix-typos`: the corrected address already exists in this origin, so the row stays an `invalid` typo. */
  fixSkipped?: "collision";
};

export type StatusUpdate = { kind: "status"; id: string; status: "valid" | "invalid" };
export type FixUpdate = { kind: "fix"; id: string; from: string; to: string; status: "valid" | "invalid" | "unverified" };
export type Update = StatusUpdate | FixUpdate;

/** `--fix-typos`: the planned corrected email per row id, and the rows whose fix would collide. */
export type TypoFixes = { fixes: ReadonlyMap<string, string>; collisions: ReadonlyMap<string, string> };

const NO_FIXES: TypoFixes = { fixes: new Map(), collisions: new Map() };

const emailKey = (origin: string, email: string) => `${origin}\n${email.toLowerCase()}`;

/** `unverified` rows whose domain is in the typo map and whose corrected address is valid, with that address. */
export function typoFixCandidates(rows: SubscriptionRow[]): { row: SubscriptionRow; to: string }[] {
  return rows.flatMap((row) => {
    if (row.emailStatus !== "unverified") return [];
    const to = correctTypoDomain(row.email);
    return to && checkEmailSyntaxAndTypos(to).ok ? [{ row, to }] : [];
  });
}

/**
 * Which typo rows to fix. A fix is skipped as a collision when a row of the same origin already has the corrected address
 * (case-insensitively), or when an older typo row of the same origin is fixed to the same address – the oldest one wins.
 */
export function planTypoFixes(rows: SubscriptionRow[], existing: ExistingEmail[]): TypoFixes {
  const taken = new Set(existing.map(({ origin, email }) => emailKey(origin, email)));
  const candidates = typoFixCandidates(rows).sort((a, b) => a.row.createdAt.getTime() - b.row.createdAt.getTime() || (a.row.id < b.row.id ? -1 : a.row.id > b.row.id ? 1 : 0));
  const fixes = new Map<string, string>();
  const collisions = new Map<string, string>();
  for (const { row, to } of candidates) {
    const key = emailKey(row.origin, to);
    if (taken.has(key)) {
      collisions.set(row.id, to);
    } else {
      taken.add(key);
      fixes.set(row.id, to);
    }
  }
  return { fixes, collisions };
}

/**
 * Distinct lowercase domains that need a DNS check: of `unverified` rows with valid syntax and no typo-map domain (suspects
 * included), plus the corrected domains of planned typo fixes.
 */
export function domainsToCheck(rows: SubscriptionRow[], { fixes }: TypoFixes = NO_FIXES): string[] {
  const domains = new Set<string>();
  for (const row of rows) {
    if (row.emailStatus !== "unverified") continue;
    const fix = fixes.get(row.id);
    const domain = emailDomain(fix ?? row.email);
    if (domain && (fix || checkEmailSyntaxAndTypos(row.email).ok)) domains.add(domain);
  }
  return [...domains].sort();
}

function dnsStatus(domain: string | undefined, domainChecks: ReadonlyMap<string, DomainCheck>): Pick<Verdict, "status" | "reason"> {
  const dns = (domain && domainChecks.get(domain)) ?? "unknown";
  if (dns === "ok") return { status: "valid" };
  if (dns === "invalid") return { status: "invalid", reason: "dns" };
  return { status: "unverified" };
}

/**
 * The status of one `unverified` row:
 * - bad syntax → `invalid` (`syntax`); a domain from the typo map → `invalid` (`typo`), without DNS – unless `--fix-typos`
 *   fixes it, then the corrected domain's DNS decides;
 * - otherwise DNS decides: `ok` → `valid`, `invalid` → `invalid` (`dns`), `unknown` or not checked → stays `unverified`.
 * A look-alike warning (fuzzy match, typo TLD) only marks the row as a suspect.
 */
export function judge(row: SubscriptionRow, domainChecks: ReadonlyMap<string, DomainCheck>, { fixes, collisions }: TypoFixes = NO_FIXES): Verdict {
  const domain = emailDomain(row.email);
  const base = { id: row.id, email: row.email, origin: row.origin, domain };
  const fix = fixes.get(row.id);
  if (fix) return { ...base, ...dnsStatus(emailDomain(fix), domainChecks), fix };
  const check = checkEmailSyntaxAndTypos(row.email);
  if (!check.ok) {
    const collision = collisions.get(row.id);
    const suggestion = collision ?? check.suggestion;
    return { ...base, status: "invalid", reason: check.reason, ...(suggestion ? { suggestion } : {}), ...(collision ? { fixSkipped: "collision" as const } : {}) };
  }
  return { ...base, ...dnsStatus(domain, domainChecks), ...(check.suspect ? { suggestion: check.suspect, suspect: true } : {}) };
}

/**
 * Verdicts for every `unverified` row and the updates to write. Rows in any other status (notably `bounced`, set from Ecomail)
 * are skipped and never written; rows that stay `unverified` produce no update unless their email is fixed.
 */
export function planStatuses(rows: SubscriptionRow[], domainChecks: ReadonlyMap<string, DomainCheck>, typoFixes: TypoFixes = NO_FIXES): { verdicts: Verdict[]; updates: Update[]; skipped: number } {
  const verdicts: Verdict[] = [];
  const updates: Update[] = [];
  let skipped = 0;
  for (const row of rows) {
    if (row.emailStatus !== "unverified") {
      skipped++;
      continue;
    }
    const verdict = judge(row, domainChecks, typoFixes);
    verdicts.push(verdict);
    if (verdict.fix) updates.push({ kind: "fix", id: verdict.id, from: verdict.email, to: verdict.fix, status: verdict.status });
    else if (verdict.status !== "unverified") updates.push({ kind: "status", id: verdict.id, status: verdict.status });
  }
  return { verdicts, updates, skipped };
}

const APPLY_KINDS = ["fix", "invalid", "valid"] as const;
const applyKind = (update: Update) => (update.kind === "fix" ? "fix" : update.status);

/**
 * Deterministic apply order that makes a `--limit` canary exercise every kind: one typo fix, one `invalid` and one `valid` first,
 * then the rest of the fixes, invalids and valids, each sorted by id.
 */
export function orderForApply(updates: Update[]): Update[] {
  const byId = (a: Update, b: Update) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const byKind = APPLY_KINDS.map((kind) => updates.filter((update) => applyKind(update) === kind).sort(byId));
  return [...byKind.flatMap((items) => items.slice(0, 1)), ...byKind.flatMap((items) => items.slice(1))];
}
