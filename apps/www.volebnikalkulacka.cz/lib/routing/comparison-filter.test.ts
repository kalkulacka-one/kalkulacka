import { describe, expect, it } from "vitest";

import { COMPARISON_FILTER_PARAM, comparisonFilterQuery, parseComparisonFilter } from "./comparison-filter";

describe("comparisonFilterQuery", () => {
  it("writes nothing for everything", () => {
    expect(comparisonFilterQuery(undefined)).toBe("");
  });

  it("writes the starred questions and a topic slug on the one parameter", () => {
    expect(comparisonFilterQuery("important")).toBe(`?${COMPARISON_FILTER_PARAM}=dulezite`);
    expect(comparisonFilterQuery({ topic: "zivotni-prostredi" })).toBe(`?${COMPARISON_FILTER_PARAM}=zivotni-prostredi`);
  });

  it("escapes what a slug should never contain, rather than trusting it", () => {
    expect(comparisonFilterQuery({ topic: "a b&c" })).toBe(`?${COMPARISON_FILTER_PARAM}=a%20b%26c`);
  });
});

describe("parseComparisonFilter", () => {
  it("reads a missing or empty parameter as everything", () => {
    expect(parseComparisonFilter(null)).toBeUndefined();
    expect(parseComparisonFilter(undefined)).toBeUndefined();
    expect(parseComparisonFilter("")).toBeUndefined();
  });

  it("reads the starred questions and leaves any other value to the page as a topic slug", () => {
    expect(parseComparisonFilter("dulezite")).toBe("important");
    expect(parseComparisonFilter("doprava")).toEqual({ topic: "doprava" });
  });

  it("round-trips", () => {
    for (const filter of [undefined, "important" as const, { topic: "skolstvi" }]) {
      const query = comparisonFilterQuery(filter);
      expect(parseComparisonFilter(new URLSearchParams(query).get(COMPARISON_FILTER_PARAM))).toEqual(filter);
    }
  });
});
