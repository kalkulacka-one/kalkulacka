import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BulkSubscriber } from "./api.ts";
import type { CliOptions } from "./cli.ts";
import type { PullResult } from "./pull.ts";
import { push } from "./push.ts";
import type { PushCandidateRow } from "./push-plan.ts";
import { IncompletePullError, runSync } from "./sync-cli.ts";

const DRY: CliOptions = { apply: false, verbose: false, limit: undefined };
const APPLY: CliOptions = { apply: true, verbose: false, limit: 10 };
const done = (planned: number, written = planned, emails: string[] = []): PullResult => ({ planned, written, emails: new Set(emails) });

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runSync", () => {
  it("runs the full pull before the push and applies --limit to the push only", async () => {
    const calls: [string, CliOptions][] = [];
    await runSync(APPLY, {
      pull: async (options) => {
        await Promise.resolve();
        calls.push(["pull", options]);
        return done(3);
      },
      push: async (options) => {
        calls.push(["push", options]);
      },
    });
    expect(calls).toEqual([
      ["pull", { ...APPLY, limit: undefined }],
      ["push", APPLY],
    ]);
  });

  it("skips the push when the pull fails", async () => {
    const push = vi.fn(async () => {});
    await expect(runSync(APPLY, { pull: () => Promise.reject(new Error("GET failed")), push })).rejects.toThrow("GET failed");
    expect(push).not.toHaveBeenCalled();
  });

  it("skips the push and fails when the pull wrote less than it planned", async () => {
    const push = vi.fn(async () => {});
    await expect(runSync(APPLY, { pull: async () => done(5, 4), push })).rejects.toThrow(IncompletePullError);
    expect(push).not.toHaveBeenCalled();
  });

  it("hands the pull's planned addresses to the push", async () => {
    const push = vi.fn(async () => {});
    await runSync(DRY, { pull: async () => done(2, 0, ["a@example.cz"]), push });
    expect(push).toHaveBeenCalledWith(DRY, new Set(["a@example.cz"]));
  });
});

describe("sync dry-run", () => {
  const origins = ["subscribe-form"];
  const row = (id: string, email: string): PushCandidateRow => ({
    id,
    email,
    origin: "subscribe-form",
    createdAt: new Date(`2025-01-0${id}T00:00:00Z`),
    metadata: null,
    emailStatus: "valid",
    unsubscribedAt: null,
  });
  // `b` is in Ecomail (say unsubscribed there) but not marked yet: the pull plans to write it.
  const before = [row("1", "a@example.cz"), row("2", " B@Example.cz"), row("3", "c@example.cz")];
  const afterPull = [before[0], before[2]].filter((candidate) => candidate !== undefined);

  async function syncWith(options: CliOptions, candidates: PushCandidateRow[]) {
    const sent: BulkSubscriber[][] = [];
    let planned: string[] = [];
    await runSync(options, {
      pull: async () => done(1, options.apply ? 1 : 0, ["b@example.cz"]),
      push: async (pushOptions, exclude) => {
        const deps = {
          fetchCandidates: async () => candidates,
          subscribeBulk: async (subscribers: BulkSubscriber[]) => {
            sent.push(subscribers);
            return { ok: true as const, inserts: subscribers.length };
          },
          markRows: async () => 0,
          now: () => new Date("2026-10-05T10:00:00Z"),
        };
        planned = (await push(deps, pushOptions, { listId: 3, origins }, exclude)).planned;
      },
    });
    return { planned, sent: sent.flat().map((subscriber) => subscriber.email) };
  }

  it("plans the push as if the pull's markers were written, matching what a real run sends", async () => {
    const dry = await syncWith(DRY, before);
    // A real run reads candidates after the pull has marked `b` in the DB.
    const real = await syncWith({ ...DRY, apply: true }, afterPull);
    expect(dry.planned).toEqual(["a@example.cz", "c@example.cz"]);
    expect(dry.sent).toEqual([]);
    expect(real.sent).toEqual(dry.planned);
  });
});
