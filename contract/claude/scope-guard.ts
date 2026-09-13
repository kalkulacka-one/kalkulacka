// Claude Code PreToolUse guard (contract T12 – steering, not a guarantee; Bash writes and other
// harnesses bypass it, and a broken classifier fails open for everything except contract/).
//   product path   → stay silent (normal permission flow applies)
//   platform path  → "ask" (the human approves this specific crossing)
//   contract/ path → "deny" before anything else is even imported
//   other protected paths → "deny" while the classifier is loadable

import { relative, resolve } from "node:path";

type HookInput = { cwd?: string; tool_input?: { file_path?: string; notebook_path?: string } };

function respond(permissionDecision: "ask" | "deny", permissionDecisionReason: string): never {
  console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision, permissionDecisionReason } }));
  process.exit(0);
}

const raw = await new Promise<string>((resolvePromise) => {
  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });
  process.stdin.on("end", () => resolvePromise(data));
});

let input: HookInput;
try {
  input = JSON.parse(raw) as HookInput;
} catch {
  process.exit(0);
}

const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
if (!target) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const path = relative(root, resolve(root, target));
if (path.startsWith("..")) process.exit(0); // outside the repository – not ours to judge

// Deny the contract directory before importing anything – this holds even when the classifier
// itself is broken or missing.
if (path === "contract" || path.startsWith("contract/")) {
  respond("deny", `Protected path (${path}): agents never write under contract/ – see contract/README.md.`);
}

try {
  const { classify } = await import("../scripts/classify.ts");
  const { verdict, escalations } = classify([{ path }]);
  const reason = escalations[0]?.reason ?? verdict;
  if (verdict === "protected") {
    respond("deny", `Protected path (${path}): ${reason}. Agents never write here – see contract/README.md.`);
  }
  if (verdict === "platform" || verdict === "calculation") {
    respond("ask", `${verdict === "calculation" ? "Result calculation" : "Platform-scope"} path (${path}): ${reason}. Requires explicit human approval – see AGENTS.md.`);
  }
} catch {
  process.exit(0); // classifier unavailable or broken – steering off, fail open by design
}
process.exit(0);
