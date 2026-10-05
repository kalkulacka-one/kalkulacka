import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { runSync } from "./sync-cli.ts";

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runSync", () => {
  it("runs the pull before the push", async () => {
    const calls: string[] = [];
    await runSync({
      pull: async () => {
        await Promise.resolve();
        calls.push("pull");
      },
      push: async () => {
        calls.push("push");
      },
    });
    expect(calls).toEqual(["pull", "push"]);
  });

  it("skips the push when the pull fails", async () => {
    const push = vi.fn(async () => {});
    await expect(runSync({ pull: () => Promise.reject(new Error("GET failed")), push })).rejects.toThrow("GET failed");
    expect(push).not.toHaveBeenCalled();
  });
});
