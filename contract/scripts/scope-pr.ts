// PR reporter (contract T12 – report-only): classifies the pull request, applies scope:/tag:
// labels, and upserts one verdict comment. Runs in CI with GITHUB_TOKEN; DRY_RUN=1 prints the
// planned API calls instead. Protected: agents never edit.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const MARKER = "<!-- scope-verdict -->";

const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH ?? "", "utf8"));
const repo = process.env.GITHUB_REPOSITORY ?? "";
const prNumber: number = event.pull_request.number;
const baseRef: string = event.pull_request.base.ref;
const headSha: string = event.pull_request.head.sha;
const dryRun = process.env.DRY_RUN === "1";

async function api(method: string, path: string, body?: unknown, tolerate: number[] = []): Promise<unknown> {
  if (dryRun) {
    console.log(`[dry-run] ${method} ${path}`, body ? JSON.stringify(body).slice(0, 120) : "");
    return method === "GET" ? [] : undefined;
  }
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: "application/vnd.github+json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (tolerate.includes(response.status)) return undefined;
  if (!response.ok) throw new Error(`${method} ${path} → ${response.status} ${await response.text()}`);
  return response.status === 204 ? undefined : response.json();
}

const result = JSON.parse(
  execFileSync("node", ["--no-warnings", "contract/scripts/scope.ts", "--json", "--base", `origin/${baseRef}`], { encoding: "utf8" }),
) as { verdict: string; tags: string[]; instances: string[]; size: string; escalations: { path: string; tag: string; reason: string }[] };

const wanted = [`scope:${result.verdict}`, ...result.tags.map((tag) => `tag:${tag}`)];

async function report(): Promise<void> {
  for (const name of wanted) {
    await api("POST", `/repos/${repo}/labels`, { name, color: name.startsWith("scope:") ? "b60205" : "c5def5" }, [422]);
  }
  const current = ((await api("GET", `/repos/${repo}/issues/${prNumber}/labels?per_page=100`)) ?? []) as { name: string }[];
  for (const { name } of current) {
    if ((name.startsWith("scope:") || name.startsWith("tag:")) && !wanted.includes(name)) {
      await api("DELETE", `/repos/${repo}/issues/${prNumber}/labels/${encodeURIComponent(name)}`);
    }
  }
  await api("POST", `/repos/${repo}/issues/${prNumber}/labels`, { labels: wanted });

const escalations = result.escalations.length
  ? `\n\n**Escalations:**\n${result.escalations.map((escalation) => `- \`${escalation.path}\` → ${escalation.tag}: ${escalation.reason}`).join("\n")}`
  : "";
const body = `${MARKER}\n**Scope verdict: ${result.verdict.toUpperCase()}** · tags: ${result.tags.join(", ")} · instances: ${result.instances.join(", ")} · size: ${result.size}${escalations}\n\n<sub>Report-only (contract T12). Derived from \`contract/scopes.config.ts\` at ${headSha.slice(0, 8)}.</sub>`;
  let existing: { id: number } | undefined;
  for (let page = 1; ; page += 1) {
    const comments = ((await api("GET", `/repos/${repo}/issues/${prNumber}/comments?per_page=100&page=${page}`)) ?? []) as { id: number; body?: string }[];
    existing = existing ?? comments.find((comment) => comment.body?.includes(MARKER));
    if (comments.length < 100) break;
  }
  if (existing) await api("PATCH", `/repos/${repo}/issues/comments/${existing.id}`, { body });
  else await api("POST", `/repos/${repo}/issues/${prNumber}/comments`, { body });
  console.log(`Reported: ${wanted.join(", ")}`);
}

try {
  await report();
} catch (error) {
  // Report-only means report-only: a read-only token (fork PR) or API hiccup must not fail the
  // check – the verdict still lands in the job log.
  console.log(`Could not post to the pull request (${error instanceof Error ? error.message.slice(0, 200) : error}).`);
  console.log(`Verdict: ${result.verdict.toUpperCase()} · ${wanted.join(", ")} · instances: ${result.instances.join(", ")} · size: ${result.size}`);
}
