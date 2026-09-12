// Ported verbatim from kalkulacka-2026/packages/ui/src/question-deck/swipe-physics.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";

import { PHYSICS, REDUCED_DURATION, SPEEDS, SPRING_BACK_DURATION, shouldCommit, speedFor, springBackDuration, zoneForOffset } from "./swipePhysics";

describe("zoneForOffset", () => {
  it("reads a left drag as agree and a right drag as disagree", () => {
    expect(zoneForOffset(-50, 0)).toEqual({ zone: "agree", important: false });
    expect(zoneForOffset(50, 0)).toEqual({ zone: "disagree", important: false });
  });

  it("ignores travel too small to be intentional", () => {
    expect(zoneForOffset(PHYSICS.zoneActivateX, 0)).toBeNull();
    expect(zoneForOffset(-PHYSICS.zoneActivateX, 0)).toBeNull();
    expect(zoneForOffset(0, 0)).toBeNull();
  });

  it('arms "important" when the drag also lifts', () => {
    expect(zoneForOffset(-60, -60)).toEqual({ zone: "agree", important: true });
    expect(zoneForOffset(60, -60)).toEqual({ zone: "disagree", important: true });
  });

  it("reads a downward drag as skip", () => {
    expect(zoneForOffset(0, 80)).toEqual({ zone: "skip", important: false });
  });

  it("prefers the horizontal answer on a sloppy diagonal", () => {
    // Travelling down and right in roughly equal measure: the user was aiming
    // sideways, so this must not silently skip the question.
    expect(zoneForOffset(80, 80)).toEqual({ zone: "disagree", important: false });
  });

  it("only skips when the downward drag clearly dominates", () => {
    const dy = 100;
    const dominant = dy / PHYSICS.skipDominance;

    expect(zoneForOffset(dominant - 10, dy)?.zone).toBe("skip");
    expect(zoneForOffset(dominant + 10, dy)?.zone).toBe("disagree");
  });
});

describe("shouldCommit", () => {
  it("needs the threshold to be exceeded horizontally", () => {
    expect(shouldCommit("agree", -PHYSICS.threshold, 0)).toBe(false);
    expect(shouldCommit("agree", -PHYSICS.threshold - 1, 0)).toBe(true);
    expect(shouldCommit("disagree", PHYSICS.threshold + 1, 0)).toBe(true);
  });

  it("measures a skip against downward travel only", () => {
    expect(shouldCommit("skip", 0, PHYSICS.threshold + 1)).toBe(true);
    expect(shouldCommit("skip", 500, PHYSICS.threshold - 1)).toBe(false);
  });
});

/*
 * These two are read straight into inline `transition` strings, so there is no
 * `--ko-duration-*` token in the path for `styles.css`'s reduced-motion rule to
 * collapse — the query has to be read here or the largest movement in the app
 * (a card thrown 480px off the side of the screen) plays regardless of the
 * preference.
 */
describe("under prefers-reduced-motion", () => {
  function setReduceMotion(reduce: boolean) {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("collapses the fly-out and the spring back", () => {
    setReduceMotion(true);

    expect(speedFor("normal")).toEqual({ fly: REDUCED_DURATION, fade: REDUCED_DURATION });
    expect(speedFor("slow")).toEqual({ fly: REDUCED_DURATION, fade: REDUCED_DURATION });
    expect(springBackDuration()).toBe(REDUCED_DURATION);
  });

  it("leaves the measured timings alone when it is not asked for", () => {
    setReduceMotion(false);

    expect(speedFor("normal")).toEqual(SPEEDS.normal);
    expect(speedFor("slow")).toEqual(SPEEDS.slow);
    expect(springBackDuration()).toBe(SPRING_BACK_DURATION);
  });
});
