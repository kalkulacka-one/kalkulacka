import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DomainCheck } from "../email-validation/check-domain.ts";
import type { ExistingEmail, SubscriptionRow, Update } from "./plan.ts";
import { type CliOptions, parseCliArgs, type RunDeps, run, UsageError } from "./run.ts";

let output: string[];

beforeEach(() => {
  output = [];
  const capture = (...args: unknown[]) => {
    output.push(args.join(" "));
  };
  vi.spyOn(console, "log").mockImplementation(capture);
  vi.spyOn(console, "warn").mockImplementation(capture);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const createdAt = new Date("2026-09-01T00:00:00Z");
const ROWS: SubscriptionRow[] = [
  { id: "1", email: "a@gmail.com", origin: "komunalni-2026", emailStatus: "unverified", createdAt },
  { id: "2", email: "b@seznam.cz", origin: "komunalni-2026", emailStatus: "unverified", createdAt },
  { id: "3", email: "c@gmail.cz", origin: "subscribe-form", emailStatus: "unverified", createdAt },
  { id: "4", email: "d@gone.cz", origin: "subscribe-form", emailStatus: "unverified", createdAt },
  { id: "5", email: "e@xmail.cz", origin: "subscribe-form", emailStatus: "unverified", createdAt },
  { id: "6", email: "f@flaky.cz", origin: "subscribe-form", emailStatus: "unverified", createdAt },
];

const DNS: Record<string, DomainCheck> = { "gmail.com": "ok", "seznam.cz": "ok", "gone.cz": "invalid", "xmail.cz": "ok", "flaky.cz": "unknown" };

function fakeDeps() {
  const writes: Update[][] = [];
  const deps = {
    readRows: vi.fn(async (_origins: string[] | undefined) => ROWS),
    findExistingEmails: vi.fn(async (_emails: string[]): Promise<ExistingEmail[]> => []),
    checkDomains: vi.fn(async (domains: string[]) => new Map(domains.map((domain) => [domain, DNS[domain] ?? "unknown"] as const))),
    write: vi.fn(async (updates: Update[]) => {
      writes.push(updates);
      const fixes = updates.filter((update) => update.kind === "fix").length;
      return { fixes, statuses: updates.length - fixes };
    }),
  } satisfies RunDeps;
  return { deps, writes };
}

const DRY_RUN: CliOptions = { apply: false, verbose: false, fixTypos: false, limit: undefined, origins: undefined };

describe("parseCliArgs", () => {
  it("defaults to a dry-run over all origins", () => {
    expect(parseCliArgs([])).toEqual(DRY_RUN);
  });

  it("accepts repeated --origin, --verbose, --apply and --limit", () => {
    expect(parseCliArgs(["--origin", "a", "--origin= b ", "--verbose", "--apply", "--limit", "10"])).toEqual({ apply: true, verbose: true, fixTypos: false, limit: 10, origins: ["a", "b"] });
    expect(parseCliArgs(["--fix-typos"])).toEqual({ ...DRY_RUN, fixTypos: true });
  });

  it("only accepts --limit together with --apply", () => {
    expect(() => parseCliArgs(["--limit", "10"])).toThrow("--limit only applies to --apply");
  });

  it.each(["0", "-1", "1.5", "ten"])("rejects --limit %s", (value) => {
    expect(() => parseCliArgs(["--apply", `--limit=${value}`])).toThrow(UsageError);
  });

  it("rejects an empty origin, unknown flags and positionals", () => {
    expect(() => parseCliArgs(["--origin", " "])).toThrow("--origin expects a non-empty value");
    expect(() => parseCliArgs(["--force"])).toThrow(/Usage: validate-emails/);
    expect(() => parseCliArgs(["apply"])).toThrow(/Usage: validate-emails/);
  });
});

describe("run", () => {
  it("never writes in a dry-run", async () => {
    const { deps } = fakeDeps();
    await expect(run(DRY_RUN, deps)).resolves.toBe(0);
    expect(deps.write).not.toHaveBeenCalled();
    expect(deps.findExistingEmails).not.toHaveBeenCalled();
    expect(output).toContain("\nDry-run – nothing written. Re-run with --apply to write.");
  });

  it("passes the origins to the read and checks only the domains that need DNS", async () => {
    const { deps } = fakeDeps();
    await run({ ...DRY_RUN, origins: ["komunalni-2026", "missing"] }, deps);
    expect(deps.readRows).toHaveBeenCalledWith(["komunalni-2026", "missing"]);
    expect(deps.checkDomains).toHaveBeenCalledWith(["flaky.cz", "gmail.com", "gone.cz", "seznam.cz", "xmail.cz"]);
    expect(output).toContain('  ⚠ no unverified rows for origin "missing"');
  });

  it("prints counts per status, reason and origin, and the suspect count", async () => {
    const { deps } = fakeDeps();
    await run(DRY_RUN, deps);
    expect(output).toEqual(
      expect.arrayContaining([
        "  domains checked: 5 (ok 3, invalid 1, unknown 1)",
        "  valid: 3",
        "    of which suspect (look-alike domain, DNS ok): 1",
        "  invalid: 2",
        "    syntax: 0",
        "    typo: 1",
        "    dns: 1",
        "  stays unverified (DNS unknown, retried next run): 1",
        "  komunalni-2026: 2 / 0 / 0 / 0",
        "  subscribe-form: 1 / 2 / 1 / 1",
      ]),
    );
    expect(output.join("\n")).not.toContain("@");
  });

  it("prints invalid and suspect emails with suggestions only with --verbose", async () => {
    const { deps } = fakeDeps();
    await run({ ...DRY_RUN, verbose: true }, deps);
    expect(output).toEqual(
      expect.arrayContaining([
        "  c@gmail.cz – typo → c@gmail.com? (subscribe-form)",
        "  d@gone.cz – dns (subscribe-form)",
        "  e@xmail.cz → e@email.cz? (subscribe-form)",
        "\nDomains with DNS unknown: flaky.cz",
      ]),
    );
  });

  it("writes every planned update with --apply", async () => {
    const { deps, writes } = fakeDeps();
    await expect(run({ ...DRY_RUN, apply: true }, deps)).resolves.toBe(5);
    expect(writes).toEqual([
      [
        { kind: "status", id: "3", status: "invalid" },
        { kind: "status", id: "1", status: "valid" },
        { kind: "status", id: "4", status: "invalid" },
        { kind: "status", id: "2", status: "valid" },
        { kind: "status", id: "5", status: "valid" },
      ],
    ]);
  });

  it("slices the canary order to --limit", async () => {
    const { deps, writes } = fakeDeps();
    await expect(run({ ...DRY_RUN, apply: true, limit: 2 }, deps)).resolves.toBe(2);
    expect(writes).toEqual([
      [
        { kind: "status", id: "3", status: "invalid" },
        { kind: "status", id: "1", status: "valid" },
      ],
    ]);
  });

  it("does not call write when nothing is planned", async () => {
    const { deps } = fakeDeps();
    deps.readRows.mockResolvedValue([]);
    await expect(run({ ...DRY_RUN, apply: true }, deps)).resolves.toBe(0);
    expect(deps.write).not.toHaveBeenCalled();
  });

  it("plans typo fixes in a dry-run without writing, with counts per target and collisions", async () => {
    const { deps } = fakeDeps();
    deps.readRows.mockResolvedValue([...ROWS, { id: "7", email: "G@Gamil.com", origin: "subscribe-form", emailStatus: "unverified", createdAt }]);
    deps.findExistingEmails.mockResolvedValue([{ origin: "subscribe-form", email: "C@gmail.com" }]);

    await run({ ...DRY_RUN, fixTypos: true, verbose: true }, deps);

    expect(deps.findExistingEmails).toHaveBeenCalledWith(["c@gmail.com", "g@gmail.com"]);
    expect(deps.write).not.toHaveBeenCalled();
    expect(output).toEqual(
      expect.arrayContaining([
        "  planned: 1",
        "    → gmail.com: 1",
        "  fix skipped: collision (address already in the origin, stays invalid typo): 1",
        "  G@Gamil.com → G@gmail.com (subscribe-form)",
        "  c@gmail.cz → c@gmail.com (subscribe-form) – fix skipped: collision",
        "    typo: 1",
      ]),
    );
  });

  it("writes fixes first with --fix-typos --apply, and counts guard skips", async () => {
    const { deps, writes } = fakeDeps();
    deps.write.mockImplementation(async (updates: Update[]) => {
      writes.push(updates);
      return { fixes: 0, statuses: updates.length - 1 };
    });

    await expect(run({ ...DRY_RUN, fixTypos: true, apply: true, limit: 2 }, deps)).resolves.toBe(1);

    expect(writes).toEqual([
      [
        { kind: "fix", id: "3", from: "c@gmail.cz", to: "c@gmail.com", status: "valid" },
        { kind: "status", id: "4", status: "invalid" },
      ],
    ]);
    expect(output).toContain("  skipped (changed concurrently, or a fix that would now collide): 1 fix(es), 0 status update(s)");
  });
});
