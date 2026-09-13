// `npm run scope` – classify the current change set against contract/scopes.config.ts.
// Usage: npm run scope [-- --base <ref>] [-- --json] [-- --require-product]
// Compares the working tree (including uncommitted changes) to the merge base with <ref>.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { PRODUCT_TAGS, scopes, SIZE_LIMITS } from "../scopes.config.ts";
import { type ChangedFile, classify, globToRegExp, type Tag } from "./classify.ts";

function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function parseArgs(argv: string[]): { base: string; json: boolean; requireProduct: boolean } {
  const baseIndex = argv.indexOf("--base");
  return {
    base: baseIndex >= 0 ? argv[baseIndex + 1] : "origin/main",
    json: argv.includes("--json"),
    requireProduct: argv.includes("--require-product"),
  };
}

function changedLineCount(base: string): number {
  const mergeBase = git("merge-base", base, "HEAD");
  const lines = git("diff", "--numstat", mergeBase).split("\n").filter(Boolean);
  let total = 0;
  for (const line of lines) {
    const [added, deleted] = line.split("\t");
    if (added !== "-") total += Number(added) + Number(deleted); // binary files count as files, not lines
  }
  return total;
}

function changedFiles(base: string): ChangedFile[] {
  const mergeBase = git("merge-base", base, "HEAD");
  const lines = git("diff", "--name-status", "-M", mergeBase).split("\n").filter(Boolean);
  const files: ChangedFile[] = [];
  for (const line of lines) {
    const parts = line.split("\t");
    const status = parts[0];
    if (status.startsWith("R")) files.push({ path: parts[2], renamedFrom: parts[1] });
    else files.push({ path: parts[1] });
  }
  const untracked = git("ls-files", "--others", "--exclude-standard");
  for (const path of untracked.split("\n").filter(Boolean)) {
    if (path.startsWith(".claude/worktrees/")) continue; // local session worktrees, not repo content
    files.push({ path });
  }
  return files;
}

type MessageViolation = { path: string; reason: string };

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

/** Message files: values may change, keys may not, and the routing subtree is frozen. */
export function checkMessages(path: string, baseJson: string | undefined, headJson: string | undefined): MessageViolation | undefined {
  if (baseJson === undefined || headJson === undefined) return { path, reason: "message file added or deleted – key set changed" };
  const base = JSON.parse(baseJson) as Record<string, unknown>;
  const head = JSON.parse(headJson) as Record<string, unknown>;
  const baseKeys = flattenKeys(base).sort().join("\n");
  const headKeys = flattenKeys(head).sort().join("\n");
  if (baseKeys !== headKeys) return { path, reason: "message key set changed – only values may change" };
  if (JSON.stringify(base.routing) !== JSON.stringify(head.routing)) return { path, reason: "routing.* subtree changed – frozen (drives URL rewrites)" };
  return undefined;
}

function messageViolations(base: string, files: ChangedFile[]): MessageViolation[] {
  const mergeBase = git("merge-base", base, "HEAD");
  const violations: MessageViolation[] = [];
  for (const file of files) {
    if (!scopes.frozenMessageGlobs.some((glob) => globToRegExp(glob).test(file.path))) continue;
    let baseJson: string | undefined;
    let headJson: string | undefined;
    try {
      baseJson = git("show", `${mergeBase}:${file.path}`);
    } catch {}
    try {
      headJson = readFileSync(file.path, "utf8");
    } catch {}
    const violation = checkMessages(file.path, baseJson, headJson);
    if (violation) violations.push(violation);
  }
  return violations;
}

if (process.argv[1]?.endsWith("scope.ts")) {
  const { base, json, requireProduct } = parseArgs(process.argv.slice(2));
  const files = changedFiles(base);
  const result = classify(files);

  const violations = messageViolations(base, files);
  for (const violation of violations) {
    if (!result.tags.includes("platform")) result.tags = [...result.tags, "platform" as Tag].sort();
    if (result.verdict === "product" || result.verdict === "calculation") result.verdict = "platform";
    result.escalations.push({ path: violation.path, tag: "platform", reason: violation.reason });
  }

  const lineCount = changedLineCount(base);
  const size =
    files.length > SIZE_LIMITS.maxFiles || lineCount > SIZE_LIMITS.maxLines
      ? "over-hard-limit"
      : files.length > SIZE_LIMITS.targetFiles || lineCount > SIZE_LIMITS.targetLines
        ? "over-target"
        : "within-target";

  if (json) {
    console.log(JSON.stringify({ base, files: files.map((file) => file.path), size, lines: lineCount, ...result }, null, 2));
  } else {
    console.log(`Scope verdict: ${result.verdict.toUpperCase()}  (${files.length} changed files vs ${base})`);
    console.log(`Tags: ${result.tags.join(", ") || "–"}`);
    console.log(`Instances: ${result.instances.join(", ") || "–"}`);
    console.log(`Size: ${files.length} files / ${lineCount} lines – ${size} (target ${SIZE_LIMITS.targetFiles}/${SIZE_LIMITS.targetLines}, hard ${SIZE_LIMITS.maxFiles}/${SIZE_LIMITS.maxLines})`);
    if (size === "over-target" && result.verdict === "product") console.log("Over target: justify the size in the PR intent (contract T5).");
    if (size === "over-hard-limit" && result.verdict === "product") console.log("Over the hard limit: the no-code-review lane is refused – split or take code review (contract T5).");
    if (result.escalations.length > 0) {
      console.log("\nEscalations:");
      for (const escalation of result.escalations) console.log(`  ${escalation.path}\n    → ${escalation.tag}: ${escalation.reason}`);
    }
    if (result.verdict === "product") {
      console.log(`\nProduct-clean: reviewable from the running result. Product tags: ${PRODUCT_TAGS.join(", ")}.`);
    } else {
      console.log("\nThis change requires human code review (contract T4).");
    }
  }

  if (requireProduct && (result.verdict !== "product" || size === "over-hard-limit")) process.exit(1);
}
