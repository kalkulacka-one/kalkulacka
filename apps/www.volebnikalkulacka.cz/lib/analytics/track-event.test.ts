import { afterEach, describe, expect, it, vi } from "vitest";

import { trackEvent } from "./track-event";

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(window, "plausible");
});

describe("trackEvent", () => {
  it("does nothing when the script never installed window.plausible", () => {
    expect(window.plausible).toBeUndefined();
    expect(() => trackEvent("Calculator started", { calculator: "abc" })).not.toThrow();
  });

  it("does nothing without a window at all — a server render calling it by mistake", () => {
    vi.stubGlobal("window", undefined);
    expect(() => trackEvent("Calculator started", { calculator: "abc" })).not.toThrow();
  });

  it("forwards the event with its props under the `props` key the script expects", () => {
    const plausible = vi.fn();
    window.plausible = plausible;

    trackEvent("Calculator completed", { calculator: "abc" });
    expect(plausible).toHaveBeenCalledWith("Calculator completed", { props: { calculator: "abc" } });

    trackEvent("Result shared", { calculator: "abc", method: "link" });
    expect(plausible).toHaveBeenLastCalledWith("Result shared", { props: { calculator: "abc", method: "link" } });
  });
});
