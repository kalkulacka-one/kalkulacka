import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

import { isMain, parseCliArgs, UsageError } from "./cli.ts";

describe("parseCliArgs", () => {
  it("defaults to a dry-run", () => {
    expect(parseCliArgs([], "push")).toEqual({ apply: false, verbose: false, limit: undefined });
  });

  it("accepts --apply, --verbose and --limit", () => {
    expect(parseCliArgs(["--apply", "--limit", "10", "--verbose"], "push")).toEqual({ apply: true, verbose: true, limit: 10 });
  });

  it("only accepts --limit together with --apply", () => {
    expect(() => parseCliArgs(["--limit", "10"], "push")).toThrow("--limit only applies to --apply");
  });

  it.each(["0", "-1", "1.5", "ten"])("rejects --limit %s", (value) => {
    expect(() => parseCliArgs(["--apply", `--limit=${value}`], "push")).toThrow(UsageError);
  });

  it("accepts --max-pull-age for push only", () => {
    expect(parseCliArgs(["--apply", "--max-pull-age", "30"], "push")).toEqual({ apply: true, verbose: false, limit: undefined, maxPullAge: 30 });
    expect(() => parseCliArgs(["--max-pull-age", "30"], "sync")).toThrow("--max-pull-age only applies to push");
    expect(() => parseCliArgs(["--max-pull-age", "0"], "push")).toThrow(UsageError);
  });

  it("rejects unknown flags and positionals", () => {
    expect(() => parseCliArgs(["--force"], "push")).toThrow(/Usage: push/);
    expect(() => parseCliArgs(["apply"], "sync")).toThrow(/Usage: sync/);
  });
});

describe("isMain", () => {
  it("matches the script directly and through a symlink, not another file", () => {
    const dir = mkdtempSync(join(tmpdir(), "ecomail-ismain-"));
    try {
      const script = join(dir, "push.ts");
      const other = join(dir, "pull.ts");
      writeFileSync(script, "");
      writeFileSync(other, "");
      symlinkSync(script, join(dir, "link.ts"));
      const url = pathToFileURL(script).href;
      expect(isMain(url, script)).toBe(true);
      expect(isMain(url, join(dir, "link.ts"))).toBe(true);
      expect(isMain(url, other)).toBe(false);
      expect(isMain(url, join(dir, "missing.ts"))).toBe(false);
      expect(isMain(url, undefined)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
