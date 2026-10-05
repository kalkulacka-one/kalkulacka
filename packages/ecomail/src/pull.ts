// Ecomail → DB pull: mirrors the state of the Ecomail list into Subscription rows (presence marker, unsubscribes, hard bounces).
// Read-only towards Ecomail (GET only). Dry-run by default; writes only with --apply.
//
//   npm run pull -w @kalkulacka-one/ecomail                       # dry-run: fetch, plan, print the summary
//   npm run pull -w @kalkulacka-one/ecomail -- --verbose          # … with full email lists per category
//   npm run pull -w @kalkulacka-one/ecomail -- --apply            # write the planned changes
//   npm run pull -w @kalkulacka-one/ecomail -- --apply --limit 10 # write at most 10 row updates (canary)
//
// Env (from packages/ecomail/.env), all required: DATABASE_URL, ECOMAIL_API_KEY, ECOMAIL_LIST_ID (the Ecomail list to mirror).

import type { PrismaClient } from "@kalkulacka-one/database";

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

import { fetchListSubscribers } from "./api.ts";
import { type BySource, collectContacts, ECOMAIL_STATUSES, type EcomailRecord, type EcomailStatus, planSync, type RowUpdate, type SyncReport, UNSUBSCRIBE_SOURCES } from "./sync.ts";

const IDS_PER_STATEMENT = 1000;
const STATEMENTS_PER_TRANSACTION = 100;
const SAMPLES = 5;

const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../.env"), quiet: true });

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const verbose = args.includes("--verbose");
const limitIndex = args.indexOf("--limit");
const limit = limitIndex >= 0 ? Number(args[limitIndex + 1]) : Number.POSITIVE_INFINITY;
if (Number.isNaN(limit) || limit < 0) fail("--limit expects a non-negative number");

function fail(message: string): never {
  console.error(`ecomail pull: ${message}`);
  process.exit(1);
}

async function fetchStatus(apiKey: string, listId: number, status: EcomailStatus): Promise<EcomailRecord[]> {
  const { records, total } = await fetchListSubscribers(apiKey, listId, status, (fetched, total) => process.stderr.write(`\r  ${status}: ${fetched}${total !== undefined ? ` / ${total}` : ""}   `));
  process.stderr.write("\n");
  if (total !== undefined && total !== records.length) console.warn(`  ⚠ ${status}: Ecomail reported ${total}, fetched ${records.length} (list changed mid-scan?)`);
  return records;
}

function printCategory(label: string, emails: string[]) {
  const shown = verbose ? emails : emails.slice(0, SAMPLES);
  const more = emails.length - shown.length;
  console.log(`  ${label}: ${emails.length}${shown.length ? ` – ${shown.join(", ")}${more > 0 ? `, … (+${more})` : ""}` : ""}`);
}

function printSources(bySource: BySource) {
  for (const source of UNSUBSCRIBE_SOURCES) if (bySource[source].length) printCategory(`    from ${source}`, bySource[source]);
}

function printReport(report: SyncReport, issues: ReturnType<typeof collectContacts>["issues"], updates: RowUpdate[]) {
  console.log("\nPlanned changes (rows):");
  printCategory("newly marked as in Ecomail", report.newlyMarked);
  printCategory("unsubscribedAt set", report.unsubscribedSet);
  printSources(report.unsubscribeSources.set);
  printCategory("unsubscribedAt changed", report.unsubscribedChanged);
  printSources(report.unsubscribeSources.changed);
  printCategory("emailStatus → bounced", report.bouncedSet);
  console.log(`  rows to write: ${updates.length}`);
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

async function write(prisma: PrismaClient, updates: RowUpdate[]): Promise<number> {
  // Rows needing the same change share one statement: the marker is identical for the whole run, so the bulk first-run marking
  // collapses into a handful of `id = ANY(…)` statements; unsubscribe timestamps differ per email and group by value.
  const groups = new Map<string, { update: RowUpdate; ids: string[] }>();
  for (const update of updates) {
    const key = `${update.ecomail ? 1 : 0}|${update.bounced ? 1 : 0}|${update.unsubscribedAt?.toISOString() ?? ""}`;
    const group = groups.get(key) ?? { update, ids: [] };
    group.ids.push(update.id);
    groups.set(key, group);
  }

  const statements = [];
  for (const { update, ids } of groups.values()) {
    const marker = update.ecomail ? JSON.stringify(update.ecomail) : null;
    for (let i = 0; i < ids.length; i += IDS_PER_STATEMENT) {
      const chunk = ids.slice(i, i + IDS_PER_STATEMENT);
      // The marker is merged server-side (`||`) and only where it is still missing, so concurrent metadata writes (e.g. `cities`)
      // and an earlier `syncedAt` are never overwritten.
      statements.push(
        () => prisma.$executeRaw`
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
          WHERE "id" = ANY(${chunk}::UUID[])`,
      );
    }
  }

  let written = 0;
  for (let i = 0; i < statements.length; i += STATEMENTS_PER_TRANSACTION) {
    const counts = await prisma.$transaction(statements.slice(i, i + STATEMENTS_PER_TRANSACTION).map((statement) => statement()));
    written += counts.reduce((sum, count) => sum + count, 0);
    process.stderr.write(`\r  written ${written} / ${updates.length}   `);
  }
  process.stderr.write("\n");
  return written;
}

async function main() {
  const apiKey = process.env.ECOMAIL_API_KEY;
  if (!apiKey) fail("ECOMAIL_API_KEY is not set (packages/ecomail/.env)");
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set (packages/ecomail/.env)");
  const rawListId = process.env.ECOMAIL_LIST_ID?.trim();
  if (!rawListId) fail("ECOMAIL_LIST_ID is not set (packages/ecomail/.env)");
  if (!/^\d+$/.test(rawListId) || Number(rawListId) <= 0) fail(`ECOMAIL_LIST_ID must be a positive integer, got "${rawListId}"`);
  const listId = Number(rawListId);

  console.log(`Ecomail list ${listId} → Subscription (${apply ? "APPLY" : "dry-run"})`);
  console.log("Fetching Ecomail…");
  const byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>> = {};
  for (const status of ECOMAIL_STATUSES) byStatus[status] = await fetchStatus(apiKey, listId, status);

  // Imported only after dotenv has run: the client reads DATABASE_URL when the module loads.
  const { prisma } = await import("@kalkulacka-one/database");
  try {
    console.log("Reading subscriptions…");
    const rows = await prisma.subscription.findMany({ select: { id: true, email: true, createdAt: true, metadata: true, emailStatus: true, unsubscribedAt: true } });
    console.log(`  ${rows.length} rows`);

    const { contacts, issues } = collectContacts(byStatus);
    const { updates, report } = planSync({ contacts, rows, listId, now: new Date() });
    printReport(report, issues, updates);

    if (!apply) {
      console.log("\nDry-run – nothing written. Re-run with --apply to write.");
      return;
    }
    const batch = updates.slice(0, limit);
    console.log(`\nWriting ${batch.length} row update(s)…`);
    const written = batch.length ? await write(prisma, batch) : 0;
    console.log(`Done: ${written} row(s) updated${written !== batch.length ? ` (planned ${batch.length})` : ""}.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
