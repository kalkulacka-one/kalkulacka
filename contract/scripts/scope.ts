// `npm run scope` – classify the current change set against contract/scopes.config.ts.
// Usage: npm run scope [-- --base <ref>] [-- --json] [-- --require-product]
// Compares the working tree (including uncommitted changes) to the merge base with <ref>.

import { PRODUCT_TAGS, SIZE_LIMITS } from "../scopes.config.ts";
import { classify, type Tag } from "./classify.ts";
import { changedFiles, changedLineCount } from "./git.ts";
import { messageViolations } from "./messages.ts";

const argv = process.argv.slice(2);
const base = argv.includes("--base") ? argv[argv.indexOf("--base") + 1] : "origin/main";
const json = argv.includes("--json");
const requireProduct = argv.includes("--require-product");

const files = changedFiles(base);
const result = classify(files);

for (const violation of messageViolations(base, files)) {
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
  if (result.escalations.length > 0) {
    console.log("\nEscalations:");
    for (const escalation of result.escalations) console.log(`  ${escalation.path}\n    → ${escalation.tag}: ${escalation.reason}`);
  }
  if (result.verdict === "product") {
    if (size === "over-target") console.log("\nOver target: justify the size in the PR intent (contract T5).");
    if (size === "over-hard-limit") console.log("\nOver the hard limit: the no-code-review lane is refused – split or take code review (contract T5).");
    console.log(`\nProduct-clean: reviewable from the running result. Product tags: ${PRODUCT_TAGS.join(", ")}.`);
  } else {
    console.log("\nThis change requires human code review (contract T4).");
  }
}

if (requireProduct && (result.verdict !== "product" || size === "over-hard-limit")) process.exit(1);
