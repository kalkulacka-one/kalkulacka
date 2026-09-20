// Content rule for message files (contract: editorial tag): values change freely; keys change
// only in lockstep – every locale file in the same directory ends with an identical key set.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { scopes } from "../scopes.config.ts";
import type { ChangedFile } from "./classify.ts";
import { globToRegExp } from "./classify.ts";

export type MessageViolation = { path: string; reason: string };

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

/** Lockstep rule: the key sets of all locale files given (path → raw JSON) must be identical. */
export function checkLockstep(files: Record<string, string>): MessageViolation[] {
  const violations: MessageViolation[] = [];
  const keySets = new Map<string, string[]>();
  for (const [path, json] of Object.entries(files)) {
    try {
      keySets.set(path, flattenKeys(JSON.parse(json)).sort());
    } catch {
      violations.push({ path, reason: "unparseable message file – fail closed" });
    }
  }
  if (violations.length > 0) return violations;
  const entries = [...keySets.entries()];
  if (entries.length === 0) return violations;
  const [referencePath, referenceKeys] = entries[0];
  const reference = new Set(referenceKeys);
  for (const [path, keys] of entries.slice(1)) {
    const missing = referenceKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !reference.has(key));
    if (missing.length > 0 || extra.length > 0) {
      const details = [...missing.map((key) => `missing "${key}"`), ...extra.map((key) => `has "${key}" absent in ${referencePath}`)].join(", ");
      violations.push({ path, reason: `locale key sets diverge from ${referencePath}: ${details}` });
    }
  }
  return violations;
}

export function messageViolations(_base: string, files: ChangedFile[]): MessageViolation[] {
  const violations: MessageViolation[] = [];
  const lockstepDirs = new Set<string>();
  for (const file of files) {
    if (!scopes.lockstepMessageGlobs.some((glob) => globToRegExp(glob).test(file.path))) continue;
    let headJson: string | undefined;
    try {
      headJson = readFileSync(file.path, "utf8");
    } catch {}
    if (headJson === undefined) {
      violations.push({ path: file.path, reason: "locale file deleted – every locale keeps its file" });
      continue;
    }
    lockstepDirs.add(dirname(file.path));
  }
  for (const dir of lockstepDirs) {
    const siblings: Record<string, string> = {};
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".json")) continue;
      try {
        siblings[join(dir, name)] = readFileSync(join(dir, name), "utf8");
      } catch {}
    }
    violations.push(...checkLockstep(siblings));
  }
  return violations;
}
