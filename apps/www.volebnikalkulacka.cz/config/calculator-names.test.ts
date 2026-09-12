import { describe, expect, it } from "vitest";

import { calculatorNames, electionName } from "./calculator-names";

describe("calculatorNames", () => {
  it("names a variant calculator from the config, which the data does not carry", () => {
    expect(calculatorNames({ group: "snemovni-2025", key: "expresni" })).toEqual({
      electionName: "Sněmovní volby 2025",
      calculatorName: "Expresní kalkulačka",
    });
  });

  it("names a district calculator from the data, next to the election name from the config", () => {
    // The full title would repeat the election name above it.
    expect(calculatorNames({ group: "komunalni-2026", key: "beroun", shortTitle: "Beroun", fallback: "Komunální volby 2026: Beroun" })).toEqual({
      electionName: "Komunální volby 2026",
      calculatorName: "Beroun",
    });
  });

  it("keeps the configured name where the data also offers a short title", () => {
    expect(calculatorNames({ group: "snemovni-2025", key: "kalkulacka", shortTitle: "Kalkulačka" }).calculatorName).toBe("Volební kalkulačka");
  });

  it("falls back to the full title, then to the key", () => {
    expect(calculatorNames({ key: "nekde", fallback: "Kalkulačka odněkud" }).calculatorName).toBe("Kalkulačka odněkud");
    expect(calculatorNames({ key: "nekde" }).calculatorName).toBe("nekde");
    expect(calculatorNames({}).calculatorName).toBe("");
  });

  it("has no election name for a calculator outside a known group", () => {
    expect(calculatorNames({ group: "krajske-2028", key: "brno" }).electionName).toBeUndefined();
  });
});

describe("electionName", () => {
  it("names the elections the site knows", () => {
    expect(electionName("komunalni-2026")).toBe("Komunální volby 2026");
    expect(electionName("senatni-2026")).toBe("Senátní volby 2026");
    expect(electionName("krajske-2028")).toBeUndefined();
  });
});
