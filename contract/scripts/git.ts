// Git access for the scope tooling: what changed relative to the merge base with a ref.

import { execFileSync } from "node:child_process";

import type { ChangedFile } from "./classify.ts";

export function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

export const mergeBase = (base: string) => git("merge-base", base, "HEAD");

/** Committed and working-tree changes, plus untracked files; renames carry their origin. */
export function changedFiles(base: string): ChangedFile[] {
  const files: ChangedFile[] = [];
  for (const line of git("diff", "--name-status", "-M", mergeBase(base)).split("\n").filter(Boolean)) {
    const parts = line.split("\t");
    if (parts[0].startsWith("R")) files.push({ path: parts[2], renamedFrom: parts[1] });
    else files.push({ path: parts[1] });
  }
  for (const path of git("ls-files", "--others", "--exclude-standard").split("\n").filter(Boolean)) {
    if (path.startsWith(".claude/worktrees/")) continue; // local session worktrees, not repo content
    files.push({ path });
  }
  return files;
}

/** Changed line count vs the merge base; binary files count as files, not lines. */
export function changedLineCount(base: string): number {
  let total = 0;
  for (const line of git("diff", "--numstat", mergeBase(base)).split("\n").filter(Boolean)) {
    const [added, deleted] = line.split("\t");
    if (added !== "-") total += Number(added) + Number(deleted);
  }
  return total;
}
