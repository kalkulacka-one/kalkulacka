// Subscriber email validation: sets `emailStatus` of `unverified` Subscription rows to `valid` or `invalid`.
// Syntax (Zod `z.email()`), typo domains (flagged with a suggestion, never auto-corrected) and DNS (MX, else A/AAAA). No SMTP probing.
// Rows whose DNS lookup fails transiently stay `unverified` and are retried on the next run. `bounced` rows are never touched.
// Dry-run by default; writes only with --apply.
//
//   npm run validate-emails -w @kalkulacka-one/app                                  # dry-run: counts only, no emails printed
//   npm run validate-emails -w @kalkulacka-one/app -- --origin komunalni-2026       # only these origins (repeatable)
//   npm run validate-emails -w @kalkulacka-one/app -- --verbose                     # … plus the invalid emails with reason and suggestion
//   npm run validate-emails -w @kalkulacka-one/app -- --apply --limit 10            # canary: one invalid and one valid first
//   npm run validate-emails -w @kalkulacka-one/app -- --apply                       # write everything planned
//
// Env (packages/app/.env): DATABASE_URL.
//
// Writes commit batch by batch, so a failure mid-run leaves a partial apply. Re-running is safe: it only reads rows that are still
// `unverified`, and every UPDATE is guarded by `"emailStatus" = 'unverified'`.

import { Resolver } from "node:dns/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { config } from "dotenv";

import { checkDomains, type DomainCheck } from "../check-domain";
import { domainsToCheck, orderForApply, planStatuses, type Reason, type Verdict } from "./plan";
import { write } from "./write";

const DNS_CONCURRENCY = 20;
const DNS_TIMEOUT_MS = 10_000;
const REASONS: Reason[] = ["syntax", "typo", "dns-invalid", "dns-unknown"];

function fail(message: string): never {
  console.error(`validate-emails: ${message}`);
  process.exit(1);
}

function parseCli() {
  let values: { apply?: boolean; verbose?: boolean; limit?: string; origin?: string[] };
  try {
    ({ values } = parseArgs({
      options: { apply: { type: "boolean" }, verbose: { type: "boolean" }, limit: { type: "string" }, origin: { type: "string", multiple: true } },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    fail(`${error instanceof Error ? error.message : String(error)}\nUsage: validate-emails [--origin X …] [--verbose] [--apply [--limit N]]`);
  }
  let limit: number | undefined;
  if (values.limit !== undefined) {
    if (!values.apply) fail("--limit only applies to --apply");
    if (!/^\d+$/.test(values.limit) || Number(values.limit) <= 0) fail(`--limit expects a positive integer, got "${values.limit}"`);
    limit = Number(values.limit);
  }
  const origins = values.origin?.map((origin) => origin.trim());
  if (origins?.some((origin) => !origin)) fail("--origin expects a non-empty value");
  return { apply: values.apply ?? false, verbose: values.verbose ?? false, limit, origins };
}

const { apply, verbose, limit, origins } = parseCli();

// Compiled to dist/email-validation/cli/, so the package root is three levels up.
config({ path: resolve(__dirname, "../../../.env"), quiet: true });

function count<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.reduce((sum, item) => sum + (predicate(item) ? 1 : 0), 0);
}

function printReport(verdicts: Verdict[], domainChecks: Map<string, DomainCheck>, skipped: number) {
  const checks = [...domainChecks.values()];
  console.log("\nDNS:");
  console.log(
    `  domains checked: ${domainChecks.size} (ok ${count(checks, (check) => check === "ok")}, invalid ${count(checks, (check) => check === "invalid")}, unknown ${count(checks, (check) => check === "unknown")})`,
  );

  console.log("\nPlanned statuses (rows):");
  console.log(`  valid: ${count(verdicts, (verdict) => verdict.status === "valid")}`);
  console.log(`  invalid: ${count(verdicts, (verdict) => verdict.status === "invalid")}`);
  for (const reason of REASONS.filter((reason) => reason !== "dns-unknown")) console.log(`    ${reason}: ${count(verdicts, (verdict) => verdict.reason === reason)}`);
  console.log(`  stays unverified (DNS unknown, retried next run): ${count(verdicts, (verdict) => verdict.reason === "dns-unknown")}`);
  if (skipped) console.log(`  skipped (not unverified): ${skipped}`);

  console.log("\nPer origin (valid / invalid / unverified):");
  const byOrigin = new Map<string, Verdict[]>();
  for (const verdict of verdicts) {
    const items = byOrigin.get(verdict.origin) ?? [];
    items.push(verdict);
    byOrigin.set(verdict.origin, items);
  }
  for (const [origin, items] of [...byOrigin].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${origin}: ${count(items, (item) => item.status === "valid")} / ${count(items, (item) => item.status === "invalid")} / ${count(items, (item) => item.status === "unverified")}`);
  }

  if (!verbose) return;
  console.log("\nInvalid emails:");
  for (const verdict of verdicts.filter((item) => item.status === "invalid")) {
    console.log(`  ${verdict.email} – ${verdict.reason}${verdict.suggestion ? ` → ${verdict.suggestion}` : ""} (${verdict.origin})`);
  }
  const unknown = [...domainChecks].filter(([, check]) => check === "unknown").map(([domain]) => domain);
  if (unknown.length) console.log(`\nDomains with DNS unknown: ${unknown.join(", ")}`);
}

async function main() {
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set (packages/app/.env)");

  console.log(`Subscription email validation (${apply ? `APPLY${limit !== undefined ? `, limit ${limit}` : ""}` : "dry-run"}; origins: ${origins ? origins.join(", ") : "all"})`);

  // Imported only after dotenv has run: the client reads DATABASE_URL when the module loads.
  const { prisma } = await import("@kalkulacka-one/database");
  try {
    console.log("Reading unverified subscriptions…");
    const rows = await prisma.subscription.findMany({
      where: { emailStatus: "unverified", ...(origins ? { origin: { in: origins } } : {}) },
      select: { id: true, email: true, origin: true, emailStatus: true },
    });
    console.log(`  ${rows.length} rows`);
    for (const origin of origins ?? []) if (!rows.some((row) => row.origin === origin)) console.warn(`  ⚠ no unverified rows for origin "${origin}"`);

    const domains = domainsToCheck(rows);
    console.log(`Checking DNS for ${domains.length} domains…`);
    const resolver = new Resolver({ timeout: DNS_TIMEOUT_MS, tries: 2 });
    const domainChecks = await checkDomains(domains, resolver, {
      concurrency: DNS_CONCURRENCY,
      timeoutMs: DNS_TIMEOUT_MS,
      onProgress: (checked) => process.stderr.write(`\r  ${checked} / ${domains.length}   `),
    });
    process.stderr.write("\n");

    const { verdicts, updates, skipped } = planStatuses(rows, domainChecks);
    printReport(verdicts, domainChecks, skipped);
    console.log(`\nRows to write: ${updates.length}`);

    if (!apply) {
      console.log("\nDry-run – nothing written. Re-run with --apply to write.");
      return;
    }
    const batch = orderForApply(updates).slice(0, limit);
    console.log(`\nWriting ${batch.length} row update(s): ${count(batch, (update) => update.status === "invalid")} invalid, ${count(batch, (update) => update.status === "valid")} valid…`);
    const written = batch.length
      ? await write({ executeRaw: (query, ...values) => prisma.$executeRaw(query, ...values), transaction: (statements) => prisma.$transaction(statements) }, batch, (written) =>
          process.stderr.write(`\r  written ${written} / ${batch.length}   `),
        )
      : 0;
    process.stderr.write("\n");
    console.log(`Done: ${written} row(s) updated${written !== batch.length ? ` (planned ${batch.length}; the rest changed status concurrently)` : ""}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
