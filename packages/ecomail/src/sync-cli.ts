// Pull, then push – the same flags go to both. The push only runs once the pull has succeeded: it relies on the pull's markers
// to skip addresses already in the list.
//
//   npm run sync -w @kalkulacka-one/ecomail                  # dry-run of both
//   npm run sync -w @kalkulacka-one/ecomail -- --apply       # write the pull, then send the push
//
// With --limit N, the pull writes at most N rows and the push sends at most N emails.

import { isMain, runCli } from "./cli.ts";
import { runPull } from "./pull.ts";
import { runPush } from "./push.ts";

export async function runSync(steps: { pull: () => Promise<void>; push: () => Promise<void> }): Promise<void> {
  await steps.pull();
  console.log("");
  await steps.push();
}

if (isMain(import.meta.url)) await runCli("sync", (options, env, prisma) => runSync({ pull: () => runPull(options, env, prisma), push: () => runPush(options, env, prisma) }));
