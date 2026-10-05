// DB → Ecomail push: adds valid, subscribed addresses that are not in the list yet, then marks their rows as in Ecomail.
// The only write towards Ecomail is `subscribe-bulk`, which never updates or resubscribes existing contacts. Dry-run by default.
//
//   npm run push -w @kalkulacka-one/ecomail                        # dry-run: counts per origin
//   npm run push -w @kalkulacka-one/ecomail -- --verbose           # … with the emails
//   npm run push -w @kalkulacka-one/ecomail -- --apply --limit 10  # canary: the 10 longest-waiting addresses
//   npm run push -w @kalkulacka-one/ecomail -- --apply             # send everything planned
//
// Env: as for the pull (packages/ecomail/.env). Each batch is marked right after Ecomail accepts it, so a failure mid-run
// leaves the earlier batches marked; a re-run sends only what is still unmarked, and re-sending an address is a no-op.

import { BULK_LIMIT, type BulkResult, type BulkSubscriber, subscribeBulk } from "./api.ts";
import { type CliOptions, type EcomailEnv, isMain, type PrismaClient, printCategory, prismaSqlClient, runCli } from "./cli.ts";
import { chunk, fetchCandidates, type PushCandidateRow, type PushEmail, planPush, toSubscriber } from "./push-plan.ts";
import type { RowUpdate } from "./sync.ts";
import { write } from "./write.ts";

export type PushDeps = {
  fetchCandidates: () => Promise<PushCandidateRow[]>;
  subscribeBulk: (subscribers: BulkSubscriber[]) => Promise<BulkResult>;
  markRows: (updates: RowUpdate[]) => Promise<number>;
  now: () => Date;
};

export type PushOutcome = { accepted: string[]; rejected: { email: string; reason: string }[]; failed: string[]; marked: number };

const perOrigin = (counts: Record<string, number>) =>
  Object.entries(counts)
    .map(([origin, count]) => `${origin} ${count}`)
    .join(", ") || "–";

/**
 * Sends one batch. On a 422 that names individual subscribers, those are dropped and the rest is sent once more: whether
 * Ecomail inserted the valid part of a rejected request is undocumented, and re-sending is harmless, so only a 2xx counts.
 */
async function sendBatch(deps: PushDeps, batch: PushEmail[], outcome: PushOutcome): Promise<PushEmail[]> {
  const first = await deps.subscribeBulk(batch.map(toSubscriber));
  if (first.ok) return batch;
  if (!first.rejected) {
    console.warn(`  ⚠ batch of ${batch.length} rejected as a whole: ${JSON.stringify(first.errors)}`);
    outcome.failed.push(...batch.map((email) => email.email));
    return [];
  }
  for (const [index, reason] of first.rejected) {
    const email = batch[index];
    if (email) outcome.rejected.push({ email: email.email, reason });
  }
  const rest = batch.filter((_, index) => !first.rejected?.has(index));
  if (!rest.length) return [];
  const second = await deps.subscribeBulk(rest.map(toSubscriber));
  if (second.ok) return rest;
  console.warn(`  ⚠ batch of ${rest.length} rejected again after dropping ${first.rejected.size}: ${JSON.stringify(second.errors)}`);
  outcome.failed.push(...rest.map((email) => email.email));
  return [];
}

/** The push against injected I/O; throws when a batch failed, after marking everything that was accepted. */
export async function push(deps: PushDeps, { apply, verbose, limit }: CliOptions, { listId, origins }: Pick<EcomailEnv, "listId" | "origins">): Promise<PushOutcome> {
  console.log(`Subscription [origin: ${origins.join(", ")}] → Ecomail list ${listId} (${apply ? `APPLY${limit !== undefined ? `, limit ${limit}` : ""}` : "dry-run"})`);
  console.log("Reading candidates…");
  const plan = planPush(await deps.fetchCandidates(), origins);
  console.log("\nPlanned push:");
  console.log(`  candidate rows by origin: ${perOrigin(plan.rowsByOrigin)}`);
  printCategory(
    verbose,
    `emails to send (by origin of the oldest row: ${perOrigin(plan.emailsByOrigin)})`,
    plan.emails.map((email) => email.email),
  );
  console.log(`  rows to mark: ${plan.rows}`);

  const outcome: PushOutcome = { accepted: [], rejected: [], failed: [], marked: 0 };
  if (!apply) {
    console.log("\nDry-run – nothing sent. Re-run with --apply to send.");
    return outcome;
  }

  const selected = plan.emails.slice(0, limit);
  const batches = chunk(selected, BULK_LIMIT);
  console.log(`\nSending ${selected.length} email(s) in ${batches.length} batch(es)…`);
  const marker = { listId, syncedAt: deps.now().toISOString() };
  for (const batch of batches) {
    const accepted = await sendBatch(deps, batch, outcome);
    outcome.accepted.push(...accepted.map((email) => email.email));
    const updates = accepted.flatMap((email) => email.rowIds.map((id): RowUpdate => ({ id, email: email.email, ecomail: marker, unsubscribedAt: null, bounced: false })));
    if (updates.length) outcome.marked += await deps.markRows(updates);
    process.stderr.write(`\r  sent ${outcome.accepted.length + outcome.rejected.length + outcome.failed.length} / ${selected.length}   `);
  }
  process.stderr.write("\n");

  console.log("\nDone:");
  printCategory(verbose, "accepted by Ecomail", outcome.accepted);
  console.log(`  rows marked: ${outcome.marked}`);
  printCategory(
    verbose,
    "rejected by Ecomail (not marked)",
    outcome.rejected.map(({ email, reason }) => (verbose ? `${email} (${reason})` : email)),
  );
  printCategory(verbose, "in failed batches (not marked)", outcome.failed);
  if (outcome.failed.length) throw new Error(`${outcome.failed.length} email(s) were in batches Ecomail rejected; nothing of those was marked – re-run to retry`);
  return outcome;
}

/** The push against Ecomail and the DB; `prisma` is passed in so `sync` can share one client with the pull. */
export async function runPush(options: CliOptions, { apiKey, listId, origins }: EcomailEnv, prisma: PrismaClient): Promise<void> {
  await push(
    {
      fetchCandidates: () => fetchCandidates({ queryRaw: (query, ...values) => prisma.$queryRaw<PushCandidateRow[]>(query, ...values) }, origins),
      subscribeBulk: (subscribers) => subscribeBulk(apiKey, listId, subscribers),
      markRows: (updates) => write(prismaSqlClient(prisma), updates, origins),
      now: () => new Date(),
    },
    options,
    { listId, origins },
  );
}

if (isMain(import.meta.url)) await runCli("push", runPush);
