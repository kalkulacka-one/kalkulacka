// Claude Code PreToolUse guard (contract T12 – steering, not a guarantee).
// Reads the tool call from stdin and judges the target path against contract/scopes.config.ts:
//   product path   → stay silent (normal permission flow applies)
//   platform path  → "ask" (the human approves this specific crossing)
//   protected path → "deny" (never autonomous, in every permission mode)
// If the classifier is not present on this branch yet, the guard allows everything.

import { relative, resolve } from "node:path";

type HookInput = { tool_input?: { file_path?: string; notebook_path?: string } };

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

const path = relative(process.cwd(), resolve(target));
if (path.startsWith("..")) process.exit(0); // outside the repository – not ours to judge

let classify: typeof import("./classify.ts").classify;
try {
  ({ classify } = await import("./classify.ts"));
} catch {
  process.exit(0); // classifier not on this branch – steering unavailable, fail open by design
}

const { verdict, escalations } = classify([{ path }]);
const reason = escalations[0]?.reason ?? verdict;

if (verdict === "protected") {
  respond("deny", `Protected path (${path}): ${reason}. Agents never write here – see contract/contract.md.`);
}
if (verdict === "platform" || verdict === "calculation") {
  respond("ask", `${verdict === "calculation" ? "Result calculation" : "Platform-scope"} path (${path}): ${reason}. Requires explicit human approval – see AGENTS.md.`);
}
process.exit(0);
