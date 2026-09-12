import { afterEach, describe, expect, it, vi } from "vitest";

import { elections2026Live } from "./feature-flags";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("elections2026Live", () => {
  it("is on only for an explicit `true`", () => {
    vi.stubEnv("ELECTIONS_2026", "true");
    expect(elections2026Live()).toBe(true);
  });

  it("is off when unset, so the teaser is what a fresh environment serves", () => {
    vi.stubEnv("ELECTIONS_2026", undefined);
    expect(elections2026Live()).toBe(false);
  });

  it("is off for anything else, rather than treating any value as truthy", () => {
    vi.stubEnv("ELECTIONS_2026", "1");
    expect(elections2026Live()).toBe(false);
    vi.stubEnv("ELECTIONS_2026", "false");
    expect(elections2026Live()).toBe(false);
  });
});
