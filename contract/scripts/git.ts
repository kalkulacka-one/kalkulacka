// Git access for the scope tooling: what changed relative to the merge base with a ref.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import type { ChangedFile } from "./classify.ts";

export function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" });
}

const mergeBases = new Map<string, string>();
export function mergeBase(base: string): string {
  let sha = mergeBases.get(base);
  if (!sha) {
    sha = git("merge-base", base, "HEAD").trim();
    mergeBases.set(base, sha);
  }
  return sha;
}

const untrackedFiles = (): string[] => git("ls-files", "--others", "--exclude-standard", "-z").split("\0").filter(Boolean);

/** Committed and working-tree changes, plus untracked files; renames carry their origin. */
export function changedFiles(base: string): ChangedFile[] {
  const files: ChangedFile[] = [];
  const tokens = git("diff", "--name-status", "-z", "-M", mergeBase(base)).split("\0").filter(Boolean);
  for (let i = 0; i < tokens.length; ) {
    const status = tokens[i];
    if (status.startsWith("R") || status.startsWith("C")) {
      files.push({ path: tokens[i + 2], renamedFrom: tokens[i + 1] });
      i += 3;
    } else {
      files.push({ path: tokens[i + 1] });
      i += 2;
    }
  }
  for (const path of untrackedFiles()) files.push({ path });
  return files;
}

/** Changed line count vs the merge base, untracked files included; binary counts as a file only. */
export function changedLineCount(base: string): number {
  let total = 0;
  for (const line of git("diff", "--numstat", mergeBase(base)).split("\n").filter(Boolean)) {
    const [added, deleted] = line.split("\t");
    if (added !== "-") total += Number(added) + Number(deleted);
  }
  for (const path of untrackedFiles()) {
    try {
      const content = readFileSync(path, "utf8");
      if (!content.includes("\0")) total += content.split("\n").length - 1;
    } catch {}
  }
  return total;
}
