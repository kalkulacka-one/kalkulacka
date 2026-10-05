// Subscriber email validation: sets `emailStatus` of `unverified` Subscription rows to `valid` or `invalid`.
// Syntax (Zod `z.email()`) and the hand-curated typo map decide on their own; everything else goes to DNS (MX, else A/AAAA).
// Look-alike domains (one edit from a popular one, `.con`/`.cpm`/`.cu`) are only reported as suspects – DNS decides. No SMTP.
// Rows whose DNS lookup fails transiently stay `unverified` and are retried on the next run. `bounced` rows are never touched.
// With --fix-typos, rows whose domain is in the typo map get the domain corrected (local part kept; skipped on a same-origin
// collision), `metadata.emailCorrectedFrom` set, and the status of the corrected domain.
// Dry-run by default; writes only with --apply. The reason is printed, never stored.
//
//   npm run validate-emails -w @kalkulacka-one/scripts                                  # dry-run: counts only, no emails printed
//   npm run validate-emails -w @kalkulacka-one/scripts -- --origin komunalni-2026       # only these origins (repeatable)
//   npm run validate-emails -w @kalkulacka-one/scripts -- --verbose                     # … plus invalid and suspect emails with suggestions
//   npm run validate-emails -w @kalkulacka-one/scripts -- --fix-typos --verbose         # … plus the planned typo fixes, original → corrected
//   npm run validate-emails -w @kalkulacka-one/scripts -- --apply --limit 10            # canary: one fix, one invalid and one valid first
//   npm run validate-emails -w @kalkulacka-one/scripts -- --apply                       # write everything planned
//
// Env (packages/scripts/.env): DATABASE_URL.
//
// Writes commit batch by batch, so a failure mid-run leaves a partial apply. Re-running is safe: it only reads rows that are still
// `unverified`, and every UPDATE is guarded by `"emailStatus" = 'unverified'`.

import { Resolver } from "node:dns/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

import { checkDomains } from "./email-validation/check-domain.ts";
import type { ExistingEmail } from "./validate-emails/plan.ts";
import { parseCliArgs, run } from "./validate-emails/run.ts";
import { write } from "./validate-emails/write.ts";

const DNS_CONCURRENCY = 20;
/** Per try and server; with `tries: 1` the resolver settles within this times the number of servers. */
const DNS_RESOLVER_TIMEOUT_MS = 5_000;

function progress(text: string) {
  process.stderr.write(`\r  ${text}   `);
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));
  config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"), quiet: true });
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (packages/scripts/.env)");

  const resolver = new Resolver({ timeout: DNS_RESOLVER_TIMEOUT_MS, tries: 1 });
  // A safety net above the resolver's own timeout, so a query normally settles (and frees its concurrency slot) before it fires.
  const timeoutMs = DNS_RESOLVER_TIMEOUT_MS * Math.max(1, resolver.getServers().length) + 1_000;

  // Imported only after dotenv has run: the client reads DATABASE_URL when the module loads.
  const { prisma } = await import("@kalkulacka-one/database");
  try {
    await run(options, {
      readRows: (origins) =>
        prisma.subscription.findMany({
          where: { emailStatus: "unverified", ...(origins ? { origin: { in: origins } } : {}) },
          select: { id: true, email: true, origin: true, emailStatus: true, createdAt: true },
        }),
      findExistingEmails: (emails) => prisma.$queryRaw<ExistingEmail[]>`SELECT "origin", "email" FROM "Subscription" WHERE lower("email") = ANY(${emails}::TEXT[])`,
      checkDomains: async (domains) => {
        const results = await checkDomains(domains, resolver, { concurrency: DNS_CONCURRENCY, timeoutMs, onProgress: (checked) => progress(`${checked} / ${domains.length}`) });
        process.stderr.write("\n");
        return results;
      },
      write: async (updates) => {
        const written = await write(
          { executeRaw: (query, ...values) => prisma.$executeRaw(query, ...values), transaction: (statements, options) => prisma.$transaction(statements, options) },
          updates,
          (count) => progress(`written ${count} / ${updates.length}`),
        );
        process.stderr.write("\n");
        return written;
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(`validate-emails: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
