// Matcher and config-integrity checks (contract T13/T14). Protected: agents never edit.

import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { scopes } from "../scopes.config.ts";
import { globToRegExp } from "../scripts/classify.ts";

describe("glob matcher", () => {
  it("throws on an unclosed brace instead of hanging", () => {
    expect(() => globToRegExp("a/{b,c")).toThrow(/Unclosed brace/);
  });
  it("throws on nested braces", () => {
    expect(() => globToRegExp("a/{b,{c,d}}.ts")).toThrow(/Nested braces/);
  });
  it("treats wildcards inside braces as literals", () => {
    const regex = globToRegExp("a/{b*,c}.ts");
    expect(regex.test("a/c.ts")).toBe(true);
    expect(regex.test("a/bd.ts")).toBe(false);
    expect(regex.test("a/b*.ts")).toBe(true);
  });
  it("matches nested and dotted directories under **", () => {
    expect(globToRegExp("contract/**").test("contract/scripts/deep/x.ts")).toBe(true);
    expect(globToRegExp("apps/*/public/**").test("apps/www.volebnikalkulacka.cz/public/.well-known/x")).toBe(true);
  });
});

describe("config globs correspond to the repository tree", () => {
  const root = join(import.meta.dirname, "..", "..");
  const allGlobs = [...scopes.protected, ...Object.values(scopes.tags).flat(), ...scopes.sharedEvenIfInstancePath, ...scopes.frozenMessageGlobs];
  for (const glob of allGlobs) {
    it(`${glob} anchors to something real`, () => {
      const wildcardIndex = glob.search(/[*{[]/);
      const prefix = (wildcardIndex === -1 ? glob : glob.slice(0, wildcardIndex)).replace(/\/[^/]*$/, "");
      if (prefix === "") return; // glob wildcards from the repo root – nothing to anchor
      expect(existsSync(join(root, prefix)), `stale path: ${prefix}`).toBe(true);
    });
  }
});

describe("AGENTS.md stays in sync with the config", () => {
  const agents = (() => {
    const { readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(join(import.meta.dirname, "..", "..", "AGENTS.md"), "utf8");
  })();
  for (const glob of [...scopes.protected, ...Object.values(scopes.tags).flat()]) {
    it(`mentions ${glob}`, () => {
      expect(agents.includes(glob), `AGENTS.md does not mention ${glob} – regenerate the boundary section`).toBe(true);
    });
  }
});
