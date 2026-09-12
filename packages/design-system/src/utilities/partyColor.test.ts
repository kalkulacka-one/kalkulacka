// Ported from kalkulacka-2026/packages/ui/src/party-color.test.ts
import { describe, expect, it } from "vitest";

import { partyColor } from "./partyColor";

const LIGHT_DARK = /^light-dark\((#[0-9a-f]{6}), (#[0-9a-f]{6})\)$/;

/** Independent oracle for the assertions below — deliberately not the module's own algorithm. */
function hexLightness(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
}

function hexChannels(hex: string): { r: number; g: number; b: number } {
  const value = Number.parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

describe("partyColor — no data colour", () => {
  it("returns a light-dark() pair, deterministically, for the same seed", () => {
    const first = partyColor("Piráti");
    const second = partyColor("Piráti");
    expect(first).toMatch(LIGHT_DARK);
    expect(first).toBe(second);
  });

  it("picks from the fixed palette regardless of name — not every seed collides", () => {
    const a = partyColor("ANO 2011");
    const b = partyColor("Česká pirátská strana");
    // Not asserting they differ (a hash can collide), just that both are valid.
    expect(a).toMatch(LIGHT_DARK);
    expect(b).toMatch(LIGHT_DARK);
  });
});

describe("partyColor — data colour present", () => {
  it("clamps the light-mode half into the [0.35, 0.55] lightness band", () => {
    // #ff0000 is HSL(0, 100%, 50%) — already inside the band, so this also
    // covers "no clamping needed" alongside the boundary cases below.
    const [, lightHex] = LIGHT_DARK.exec(partyColor("seed", "#ff0000")) ?? [];
    expect(lightHex).toBeDefined();
    expect(hexLightness(lightHex as string)).toBeGreaterThanOrEqual(0.34);
    expect(hexLightness(lightHex as string)).toBeLessThanOrEqual(0.56);
  });

  it("clamps the dark-mode half into the [0.55, 0.72] lightness band", () => {
    const [, , darkHex] = LIGHT_DARK.exec(partyColor("seed", "#ff0000")) ?? [];
    expect(darkHex).toBeDefined();
    expect(hexLightness(darkHex as string)).toBeGreaterThanOrEqual(0.54);
    expect(hexLightness(darkHex as string)).toBeLessThanOrEqual(0.73);
  });

  it("pulls a near-black data colour up into both bands rather than passing it through", () => {
    const result = partyColor("seed", "#0a0a12");
    const [, lightHex, darkHex] = LIGHT_DARK.exec(result) ?? [];
    expect(hexLightness(lightHex as string)).toBeGreaterThanOrEqual(0.34);
    expect(hexLightness(darkHex as string)).toBeGreaterThanOrEqual(0.54);
  });

  it("pulls a near-white data colour down into both bands rather than passing it through", () => {
    const result = partyColor("seed", "#fafaf5");
    const [, lightHex, darkHex] = LIGHT_DARK.exec(result) ?? [];
    expect(hexLightness(lightHex as string)).toBeLessThanOrEqual(0.56);
    expect(hexLightness(darkHex as string)).toBeLessThanOrEqual(0.73);
  });

  it("keeps the hue rather than replacing it with a palette colour", () => {
    // Pure red (hue 0): in RGB terms that means red is the max channel and
    // green/blue stay equal to each other at any lightness — an independent
    // check on hue that doesn't require reimplementing HSL conversion.
    const result = partyColor("seed", "#ff0000");
    const [, lightHex, darkHex] = LIGHT_DARK.exec(result) ?? [];
    for (const hex of [lightHex, darkHex]) {
      const { r, g, b } = hexChannels(hex as string);
      expect(g).toBe(b);
      expect(r).toBeGreaterThan(g);
    }
  });

  it("keeps a grey (zero-saturation) data colour grey in both halves", () => {
    const result = partyColor("seed", "#888888");
    const [, lightHex, darkHex] = LIGHT_DARK.exec(result) ?? [];
    for (const hex of [lightHex, darkHex]) {
      const { r, g, b } = hexChannels(hex as string);
      expect(r).toBe(g);
      expect(g).toBe(b);
    }
  });

  it("accepts the 3-digit shorthand form", () => {
    expect(partyColor("seed", "#f00")).toMatch(LIGHT_DARK);
  });

  it("produces the same normalized pair regardless of seed — the data colour, not the hash, drives it", () => {
    expect(partyColor("Piráti", "#2563eb")).toBe(partyColor("ANO 2011", "#2563eb"));
  });
});

describe("partyColor — malformed or absent data colour falls back to the hash palette", () => {
  it("falls back on a value with no leading #", () => {
    expect(partyColor("Piráti", "ff0000")).toBe(partyColor("Piráti"));
  });

  it("falls back on a non-hex value", () => {
    expect(partyColor("Piráti", "red")).toBe(partyColor("Piráti"));
  });

  it("falls back on a wrong-length hex value", () => {
    expect(partyColor("Piráti", "#ff00")).toBe(partyColor("Piráti"));
  });

  it("falls back on an empty string, same as omitting the argument", () => {
    expect(partyColor("Piráti", "")).toBe(partyColor("Piráti"));
  });
});
