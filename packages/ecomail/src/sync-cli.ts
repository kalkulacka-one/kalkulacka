// Pull, then push – the normal entry point. The push relies on the pull's markers to skip addresses already in the list, so it
// only runs once the pull has written its whole plan; otherwise sync stops with an error before pushing.
//
//   npm run sync -w @kalkulacka-one/ecomail                            # dry-run of both; the push plans as if the pull were written
//   npm run sync -w @kalkulacka-one/ecomail -- --apply                 # write the pull, then send the push
//   npm run sync -w @kalkulacka-one/ecomail -- --apply --limit 10      # full pull, then a push of at most 10 emails
//
// --limit applies to the push only: a partial pull would leave addresses already in Ecomail (unsubscribed ones included)
// unmarked, and the push would treat them as new.

import { type CliOptions, isMain, runCli } from "./cli.ts";
import { type PullResult, runPull } from "./pull.ts";
import { runPush } from "./push.ts";

export class IncompletePullError extends Error {}

export async function runSync(
  options: CliOptions,
  steps: { pull: (options: CliOptions) => Promise<PullResult>; push: (options: CliOptions, exclude: ReadonlySet<string>) => Promise<void> },
): Promise<void> {
  const pulled = await steps.pull({ ...options, limit: undefined });
  if (options.apply && pulled.written !== pulled.planned) {
    throw new IncompletePullError(`the pull wrote ${pulled.written} of ${pulled.planned} planned row(s), so the push did not run – re-run sync`);
  }
  console.log("");
  await steps.push(options, pulled.emails);
}

if (isMain(import.meta.url))
  await runCli("sync", (options, env, prisma) =>
    runSync(options, { pull: (pullOptions) => runPull(pullOptions, env, prisma), push: (pushOptions, exclude) => runPush(pushOptions, env, prisma, exclude) }),
  );
