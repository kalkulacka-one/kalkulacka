import { describe, expect, it } from "vitest";

import { comparisonFilterFromId, comparisonFilterToId } from "./comparison-filter";

const topics = ["Doprava", "Životní prostředí"];

describe("comparisonFilterToId", () => {
  it("reads no filter as everything", () => {
    expect(comparisonFilterToId(undefined, topics)).toBe("all");
  });

  it("reads the starred questions", () => {
    expect(comparisonFilterToId("important", topics)).toBe("important");
  });

  it("resolves a topic slug against the calculator's topics", () => {
    expect(comparisonFilterToId({ topic: "zivotni-prostredi" }, topics)).toBe("topic:Životní prostředí");
    expect(comparisonFilterToId({ topic: "doprava" }, topics)).toBe("topic:Doprava");
  });

  it("degrades a slug that matches nothing to everything rather than failing", () => {
    expect(comparisonFilterToId({ topic: "neznamy" }, topics)).toBe("all");
    expect(comparisonFilterToId({ topic: "" }, topics)).toBe("all");
  });
});

describe("comparisonFilterFromId", () => {
  it("says nothing for everything", () => {
    expect(comparisonFilterFromId("all")).toBeUndefined();
  });

  it("names the starred questions", () => {
    expect(comparisonFilterFromId("important")).toBe("important");
  });

  it("names a topic by its slug", () => {
    expect(comparisonFilterFromId("topic:Životní prostředí")).toEqual({ topic: "zivotni-prostredi" });
  });

  it("offers no filter for a topic the URL cannot spell", () => {
    expect(comparisonFilterFromId("topic:Економија")).toBeUndefined();
  });

  it("never hands the routes the recap's own progress filter", () => {
    expect(comparisonFilterFromId("unanswered")).toBeUndefined();
  });

  it("round-trips through the calculator's topics", () => {
    for (const topic of topics) {
      const filter = comparisonFilterFromId(`topic:${topic}`);
      expect(comparisonFilterToId(filter, topics)).toBe(`topic:${topic}`);
    }
  });
});
