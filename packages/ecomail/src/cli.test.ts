import { describe, expect, it } from "vitest";

import { parseCliArgs, UsageError } from "./cli.ts";

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

  it("rejects unknown flags and positionals", () => {
    expect(() => parseCliArgs(["--force"], "push")).toThrow(/Usage: push/);
    expect(() => parseCliArgs(["apply"], "sync")).toThrow(/Usage: sync/);
  });
});
