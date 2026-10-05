import { parseArgs } from "node:util";

import type { DomainCheck } from "../email-validation/check-domain.ts";
import { domainsToCheck, orderForApply, planStatuses, REASONS, type StatusUpdate, type SubscriptionRow, type Verdict } from "./plan.ts";

export type CliOptions = { apply: boolean; verbose: boolean; limit: number | undefined; origins: string[] | undefined };

export class UsageError extends Error {}

const USAGE = "Usage: validate-emails [--origin X …] [--verbose] [--apply [--limit N]]";

/** Strict flags: `--origin X` (repeatable), `--verbose`, `--apply`, `--limit N` (positive integer, only with `--apply`). */
export function parseCliArgs(args: string[]): CliOptions {
  let values: { apply?: boolean; verbose?: boolean; limit?: string; origin?: string[] };
  try {
    ({ values } = parseArgs({
      args,
      options: { apply: { type: "boolean" }, verbose: { type: "boolean" }, limit: { type: "string" }, origin: { type: "string", multiple: true } },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    throw new UsageError(`${error instanceof Error ? error.message : String(error)}\n${USAGE}`);
  }
  let limit: number | undefined;
  if (values.limit !== undefined) {
    if (!values.apply) throw new UsageError("--limit only applies to --apply");
    if (!/^\d+$/.test(values.limit) || Number(values.limit) <= 0) throw new UsageError(`--limit expects a positive integer, got "${values.limit}"`);
    limit = Number(values.limit);
  }
  const origins = values.origin?.map((origin) => origin.trim());
  if (origins?.some((origin) => !origin)) throw new UsageError("--origin expects a non-empty value");
  return { apply: values.apply ?? false, verbose: values.verbose ?? false, limit, origins };
}

/** Everything `run` does outside planning, injected so the orchestration can be tested without a database or DNS. */
export type RunDeps = {
  readRows: (origins: string[] | undefined) => Promise<SubscriptionRow[]>;
  checkDomains: (domains: string[]) => Promise<Map<string, DomainCheck>>;
  write: (updates: StatusUpdate[]) => Promise<number>;
};

function count<T>(items: Iterable<T>, predicate: (item: T) => boolean): number {
  let sum = 0;
  for (const item of items) if (predicate(item)) sum++;
  return sum;
}

const isSuspect = (verdict: Verdict) => verdict.suspect === true && verdict.status === "valid";

function printReport(verdicts: Verdict[], domainChecks: Map<string, DomainCheck>, skipped: number, verbose: boolean) {
  const checks = [...domainChecks.values()];
  console.log("\nDNS:");
  console.log(
    `  domains checked: ${domainChecks.size} (ok ${count(checks, (check) => check === "ok")}, invalid ${count(checks, (check) => check === "invalid")}, unknown ${count(checks, (check) => check === "unknown")})`,
  );

  console.log("\nPlanned statuses (rows):");
  console.log(`  valid: ${count(verdicts, (verdict) => verdict.status === "valid")}`);
  console.log(`    of which suspect (look-alike domain, DNS ok): ${count(verdicts, isSuspect)}`);
  console.log(`  invalid: ${count(verdicts, (verdict) => verdict.status === "invalid")}`);
  for (const reason of REASONS) console.log(`    ${reason}: ${count(verdicts, (verdict) => verdict.reason === reason)}`);
  console.log(`  stays unverified (DNS unknown, retried next run): ${count(verdicts, (verdict) => verdict.status === "unverified")}`);
  if (skipped) console.log(`  skipped (not unverified): ${skipped}`);

  console.log("\nPer origin (valid / invalid / unverified / suspect):");
  const byOrigin = new Map<string, Verdict[]>();
  for (const verdict of verdicts) {
    const items = byOrigin.get(verdict.origin) ?? [];
    items.push(verdict);
    byOrigin.set(verdict.origin, items);
  }
  for (const [origin, items] of [...byOrigin].sort(([a], [b]) => a.localeCompare(b))) {
    const statuses = (["valid", "invalid", "unverified"] as const).map((status) => count(items, (item) => item.status === status));
    console.log(`  ${origin}: ${[...statuses, count(items, isSuspect)].join(" / ")}`);
  }

  if (!verbose) return;
  console.log("\nInvalid emails:");
  for (const verdict of verdicts.filter((item) => item.status === "invalid")) {
    console.log(`  ${verdict.email} – ${verdict.reason}${verdict.suggestion ? ` → ${verdict.suggestion}?` : ""} (${verdict.origin})`);
  }
  console.log("\nSuspect emails (valid, DNS ok):");
  for (const verdict of verdicts.filter(isSuspect)) console.log(`  ${verdict.email} → ${verdict.suggestion}? (${verdict.origin})`);
  const unknown = [...domainChecks].filter(([, check]) => check === "unknown").map(([domain]) => domain);
  if (unknown.length) console.log(`\nDomains with DNS unknown: ${unknown.join(", ")}`);
}

/** Reads `unverified` rows, checks DNS, prints the report and – only with `--apply` – writes the planned statuses. Returns rows written. */
export async function run({ apply, verbose, limit, origins }: CliOptions, deps: RunDeps): Promise<number> {
  console.log(`Subscription email validation (${apply ? `APPLY${limit !== undefined ? `, limit ${limit}` : ""}` : "dry-run"}; origins: ${origins ? origins.join(", ") : "all"})`);

  console.log("Reading unverified subscriptions…");
  const rows = await deps.readRows(origins);
  console.log(`  ${rows.length} rows`);
  for (const origin of origins ?? []) if (!rows.some((row) => row.origin === origin)) console.warn(`  ⚠ no unverified rows for origin "${origin}"`);

  const domains = domainsToCheck(rows);
  console.log(`Checking DNS for ${domains.length} domains…`);
  const domainChecks = await deps.checkDomains(domains);

  const { verdicts, updates, skipped } = planStatuses(rows, domainChecks);
  printReport(verdicts, domainChecks, skipped, verbose);
  console.log(`\nRows to write: ${updates.length}`);

  if (!apply) {
    console.log("\nDry-run – nothing written. Re-run with --apply to write.");
    return 0;
  }
  const batch = orderForApply(updates).slice(0, limit);
  console.log(`\nWriting ${batch.length} row update(s): ${count(batch, (update) => update.status === "invalid")} invalid, ${count(batch, (update) => update.status === "valid")} valid…`);
  const written = batch.length ? await deps.write(batch) : 0;
  console.log(`Done: ${written} row(s) updated${written !== batch.length ? ` (planned ${batch.length}; the rest changed status concurrently)` : ""}.`);
  return written;
}
