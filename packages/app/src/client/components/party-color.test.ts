import { describe, expect, it } from "vitest";

import { partyColor } from "./party-color";

describe("partyColor", () => {
  it("is deterministic for the same seed", () => {
    expect(partyColor("Česká pirátská strana")).toBe(partyColor("Česká pirátská strana"));
  });

  it("picks a colour from its fixed palette", () => {
    expect(partyColor("Česká pirátská strana")).toBe("light-dark(#4f46e5, #818cf8)");
    expect(partyColor("SPOLU")).toBe("light-dark(#d97706, #fbbf24)");
    expect(partyColor("SS – Stát Má Sloužit")).toBe("light-dark(#7c3aed, #a78bfa)");
  });

  it("falls back to the first palette colour for an empty seed", () => {
    expect(partyColor("")).toBe("light-dark(#2563eb, #3b82f6)");
  });

  it("returns different colours for different seeds", () => {
    expect(partyColor("Česká pirátská strana")).not.toBe(partyColor("SPOLU"));
  });
});
