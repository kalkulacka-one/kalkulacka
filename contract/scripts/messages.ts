// Content rules for message files (contract: editorial tag): values may change,
// keys may not, and the routing subtree is frozen.

import { readFileSync } from "node:fs";

import { scopes } from "../scopes.config.ts";
import type { ChangedFile } from "./classify.ts";
import { globToRegExp } from "./classify.ts";
import { git, mergeBase } from "./git.ts";

export type MessageViolation = { path: string; reason: string };

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

export function checkMessages(path: string, baseJson: string | undefined, headJson: string | undefined): MessageViolation | undefined {
  if (baseJson === undefined || headJson === undefined) return { path, reason: "message file added or deleted – key set changed" };
  let base: Record<string, unknown>;
  let head: Record<string, unknown>;
  try {
    base = JSON.parse(baseJson) as Record<string, unknown>;
    head = JSON.parse(headJson) as Record<string, unknown>;
  } catch {
    return { path, reason: "unparseable message file – fail closed" };
  }
  if (flattenKeys(base).sort().join("\n") !== flattenKeys(head).sort().join("\n")) return { path, reason: "message key set changed – only values may change" };
  if (JSON.stringify(base.routing) !== JSON.stringify(head.routing)) return { path, reason: "routing.* subtree changed – frozen (drives URL rewrites)" };
  return undefined;
}

export function messageViolations(base: string, files: ChangedFile[]): MessageViolation[] {
  const violations: MessageViolation[] = [];
  for (const file of files) {
    if (!scopes.frozenMessageGlobs.some((glob) => globToRegExp(glob).test(file.path))) continue;
    let baseJson: string | undefined;
    let headJson: string | undefined;
    try {
      baseJson = git("show", `${mergeBase(base)}:${file.path}`);
    } catch {}
    try {
      headJson = readFileSync(file.path, "utf8");
    } catch {}
    const violation = checkMessages(file.path, baseJson, headJson);
    if (violation) violations.push(violation);
  }
  return violations;
}
