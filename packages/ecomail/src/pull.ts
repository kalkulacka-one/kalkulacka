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

import { fetchListSubscribers } from "./api.ts";
import { type CliOptions, type EcomailEnv, isMain, type PrismaClient, printCategory, prismaSqlClient, runCli } from "./cli.ts";
import { subscriptionsQuery } from "./origins.ts";
import { type BySource, collectContacts, ECOMAIL_STATUSES, type EcomailRecord, type EcomailStatus, planSync, type SyncReport, UNSUBSCRIBE_SOURCES } from "./sync.ts";
import { countKinds, orderForApply, write } from "./write.ts";

async function fetchStatus(apiKey: string, listId: number, status: EcomailStatus): Promise<EcomailRecord[]> {
  const { records, total } = await fetchListSubscribers(apiKey, listId, status, (fetched, total) => process.stderr.write(`\r  ${status}: ${fetched}${total !== undefined ? ` / ${total}` : ""}   `));
  process.stderr.write("\n");
  if (total !== undefined && total !== records.length) console.warn(`  ⚠ ${status}: Ecomail reported ${total}, fetched ${records.length} (list changed mid-scan?)`);
  return records;
}

function printSources(verbose: boolean, bySource: BySource) {
  for (const source of UNSUBSCRIBE_SOURCES) if (bySource[source].length) printCategory(verbose, `    from ${source}`, bySource[source]);
}

function printReport(verbose: boolean, report: SyncReport, issues: ReturnType<typeof collectContacts>["issues"], rowsToWrite: number) {
  console.log("\nPlanned changes (rows):");
  printCategory(verbose, "newly marked as in Ecomail", report.newlyMarked);
  printCategory(verbose, "unsubscribedAt set", report.unsubscribedSet);
  printSources(verbose, report.unsubscribeSources.set);
  printCategory(verbose, "unsubscribedAt changed", report.unsubscribedChanged);
  printSources(verbose, report.unsubscribeSources.changed);
  printCategory(verbose, "emailStatus → bounced", report.bouncedSet);
  console.log(`  rows to write: ${rowsToWrite}`);
  console.log(`  unchanged (matched, nothing to write): ${report.unchanged}`);
  console.log(`  DB rows not in Ecomail: ${report.notInEcomail}`);
  console.log("\nReported only, never auto-resolved:");
  printCategory(verbose, "newer consent than Ecomail unsubscribe (needs re-subscribe push)", report.newerConsent);
  printSources(verbose, report.unsubscribeSources.newerConsent);
  printCategory(verbose, "unsubscribedAt set in DB but subscribed in Ecomail (re-subscribe?)", report.resubscribed);
  printCategory(verbose, "bounced in DB but not hard-bounced in Ecomail", report.bouncedNoLongerInEcomail);
  printCategory(verbose, "metadata is not an object (cannot merge marker)", report.unmergeableMetadata);
  printCategory(verbose, "in Ecomail without a DB row (not inserted)", report.ecomailOnly);
  printCategory(verbose, "Ecomail emails seen under several statuses", issues.multipleStatuses);
  printCategory(verbose, "Ecomail `bounced` without bounced_hard (not treated as hard bounce)", issues.bouncedWithoutHardFlag);
}

/** The whole pull; throws on failure. `prisma` is passed in so `sync` can share one client with the push. */
export async function runPull({ apply, verbose, limit }: CliOptions, { apiKey, listId, origins }: EcomailEnv, prisma: PrismaClient): Promise<void> {
  console.log(`Ecomail list ${listId} → Subscription [origin: ${origins.join(", ")}] (${apply ? `APPLY${limit !== undefined ? `, limit ${limit}` : ""}` : "dry-run"})`);
  console.log("Fetching Ecomail…");
  const byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>> = {};
  for (const status of ECOMAIL_STATUSES) byStatus[status] = await fetchStatus(apiKey, listId, status);

  console.log("Reading subscriptions…");
  const rows = await prisma.subscription.findMany(subscriptionsQuery(origins));
  console.log(`  ${rows.length} rows`);

  const { contacts, issues } = collectContacts(byStatus);
  const { updates, report } = planSync({ contacts, rows, origins, listId, now: new Date() });
  printReport(verbose, report, issues, updates.length);

  if (!apply) {
    console.log("\nDry-run – nothing written. Re-run with --apply to write.");
    return;
  }
  const batch = orderForApply(updates).slice(0, limit);
  const kinds = countKinds(batch);
  console.log(`\nWriting ${batch.length} row update(s): ${kinds.unsubscribe} unsubscribe, ${kinds.bounce} bounce, ${kinds.marker} marker only…`);
  const written = batch.length ? await write(prismaSqlClient(prisma), batch, origins, (count) => process.stderr.write(`\r  written ${count} / ${batch.length}   `)) : 0;
  process.stderr.write("\n");
  console.log(`Done: ${written} row(s) updated${written !== batch.length ? ` (planned ${batch.length})` : ""}.`);
}

if (isMain(import.meta.url)) await runCli("pull", runPull);
