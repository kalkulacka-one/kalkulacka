// Ecomail → DB pull: mirrors the state of an Ecomail list into Subscription rows (presence marker, unsubscribes, hard bounces).
// Read-only towards Ecomail (GET only). Dry-run by default; writes only with --apply.
//
//   npm run pull -w @kalkulacka-one/ecomail                        # dry-run: counts per category
//   npm run pull -w @kalkulacka-one/ecomail -- --verbose           # … with the emails per category
//   npm run pull -w @kalkulacka-one/ecomail -- --apply --limit 10  # canary: risky kinds (unsubscribe, bounce) first
//   npm run pull -w @kalkulacka-one/ecomail -- --apply             # write everything planned
//
// Env (packages/ecomail/.env), all required: DATABASE_URL, ECOMAIL_API_KEY, ECOMAIL_LIST_ID, ECOMAIL_ORIGINS.
// ECOMAIL_ORIGINS is the comma-separated list of Subscription origins that belong to the list (e.g. `subscribe-form,import-2022`):
// only rows of these origins are read and written; rows of other origins are invisible to the pull.
//
// Writes commit batch by batch, so a failure mid-run leaves a partial apply. Re-running is safe: the plan is idempotent and
// picks up exactly the rows that still differ.

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { config } from "dotenv";

import { fetchListSubscribers } from "./api.ts";
import { parseOrigins, subscriptionsQuery } from "./origins.ts";
import { type BySource, collectContacts, ECOMAIL_STATUSES, type EcomailRecord, type EcomailStatus, planSync, type SyncReport, UNSUBSCRIBE_SOURCES } from "./sync.ts";
import { countKinds, orderForApply, write } from "./write.ts";

function fail(message: string): never {
  console.error(`ecomail pull: ${message}`);
  process.exit(1);
}

function parseCli() {
  let values: { apply?: boolean; verbose?: boolean; limit?: string };
  try {
    ({ values } = parseArgs({
      options: { apply: { type: "boolean" }, verbose: { type: "boolean" }, limit: { type: "string" } },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    fail(`${error instanceof Error ? error.message : String(error)}\nUsage: pull [--verbose] [--apply [--limit N]]`);
  }
  let limit: number | undefined;
  if (values.limit !== undefined) {
    if (!values.apply) fail("--limit only applies to --apply");
    if (!/^\d+$/.test(values.limit) || Number(values.limit) <= 0) fail(`--limit expects a positive integer, got "${values.limit}"`);
    limit = Number(values.limit);
  }
  return { apply: values.apply ?? false, verbose: values.verbose ?? false, limit };
}

const { apply, verbose, limit } = parseCli();

const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../.env"), quiet: true });

async function fetchStatus(apiKey: string, listId: number, status: EcomailStatus): Promise<EcomailRecord[]> {
  const { records, total } = await fetchListSubscribers(apiKey, listId, status, (fetched, total) => process.stderr.write(`\r  ${status}: ${fetched}${total !== undefined ? ` / ${total}` : ""}   `));
  process.stderr.write("\n");
  if (total !== undefined && total !== records.length) console.warn(`  ⚠ ${status}: Ecomail reported ${total}, fetched ${records.length} (list changed mid-scan?)`);
  return records;
}

function printCategory(label: string, emails: string[]) {
  console.log(`  ${label}: ${emails.length}${verbose && emails.length ? ` – ${emails.join(", ")}` : ""}`);
}

function printSources(bySource: BySource) {
  for (const source of UNSUBSCRIBE_SOURCES) if (bySource[source].length) printCategory(`    from ${source}`, bySource[source]);
}

function printReport(report: SyncReport, issues: ReturnType<typeof collectContacts>["issues"], rowsToWrite: number) {
  console.log("\nPlanned changes (rows):");
  printCategory("newly marked as in Ecomail", report.newlyMarked);
  printCategory("unsubscribedAt set", report.unsubscribedSet);
  printSources(report.unsubscribeSources.set);
  printCategory("unsubscribedAt changed", report.unsubscribedChanged);
  printSources(report.unsubscribeSources.changed);
  printCategory("emailStatus → bounced", report.bouncedSet);
  console.log(`  rows to write: ${rowsToWrite}`);
  console.log(`  unchanged (matched, nothing to write): ${report.unchanged}`);
  console.log(`  DB rows not in Ecomail: ${report.notInEcomail}`);
  console.log("\nReported only, never auto-resolved:");
  printCategory("newer consent than Ecomail unsubscribe (needs re-subscribe push)", report.newerConsent);
  printSources(report.unsubscribeSources.newerConsent);
  printCategory("unsubscribedAt set in DB but subscribed in Ecomail (re-subscribe?)", report.resubscribed);
  printCategory("bounced in DB but not hard-bounced in Ecomail", report.bouncedNoLongerInEcomail);
  printCategory("metadata is not an object (cannot merge marker)", report.unmergeableMetadata);
  printCategory("in Ecomail without a DB row (not inserted)", report.ecomailOnly);
  printCategory("Ecomail emails seen under several statuses", issues.multipleStatuses);
  printCategory("Ecomail `bounced` without bounced_hard (not treated as hard bounce)", issues.bouncedWithoutHardFlag);
}

async function main() {
  const apiKey = process.env.ECOMAIL_API_KEY;
  if (!apiKey) fail("ECOMAIL_API_KEY is not set (packages/ecomail/.env)");
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set (packages/ecomail/.env)");
  const rawListId = process.env.ECOMAIL_LIST_ID?.trim();
  if (!rawListId) fail("ECOMAIL_LIST_ID is not set (packages/ecomail/.env)");
  if (!/^\d+$/.test(rawListId) || Number(rawListId) <= 0) fail(`ECOMAIL_LIST_ID must be a positive integer, got "${rawListId}"`);
  const listId = Number(rawListId);
  let origins: string[] = [];
  try {
    origins = parseOrigins(process.env.ECOMAIL_ORIGINS);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  console.log(`Ecomail list ${listId} → Subscription [origin: ${origins.join(", ")}] (${apply ? `APPLY${limit !== undefined ? `, limit ${limit}` : ""}` : "dry-run"})`);
  console.log("Fetching Ecomail…");
  const byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>> = {};
  for (const status of ECOMAIL_STATUSES) byStatus[status] = await fetchStatus(apiKey, listId, status);

  // Imported only after dotenv has run: the client reads DATABASE_URL when the module loads.
  const { prisma } = await import("@kalkulacka-one/database");
  try {
    console.log("Reading subscriptions…");
    const rows = await prisma.subscription.findMany(subscriptionsQuery(origins));
    console.log(`  ${rows.length} rows`);

    const { contacts, issues } = collectContacts(byStatus);
    const { updates, report } = planSync({ contacts, rows, origins, listId, now: new Date() });
    printReport(report, issues, updates.length);

    if (!apply) {
      console.log("\nDry-run – nothing written. Re-run with --apply to write.");
      return;
    }
    const batch = orderForApply(updates).slice(0, limit);
    const kinds = countKinds(batch);
    console.log(`\nWriting ${batch.length} row update(s): ${kinds.unsubscribe} unsubscribe, ${kinds.bounce} bounce, ${kinds.marker} marker only…`);
    const written = batch.length
      ? await write({ executeRaw: (query, ...values) => prisma.$executeRaw(query, ...values), transaction: (statements) => prisma.$transaction(statements) }, batch, origins, (count) =>
          process.stderr.write(`\r  written ${count} / ${batch.length}   `),
        )
      : 0;
    process.stderr.write("\n");
    console.log(`Done: ${written} row(s) updated${written !== batch.length ? ` (planned ${batch.length})` : ""}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
