// Ported from kalkulacka-2026/packages/ui/src/share-card/theme-colors.test.ts
import { describe, expect, it } from "vitest";

import { type CardColorSet, cardColorSet, cardCssVars, css, mix, parseColor, type Rgb, readActiveColorSet } from "./themeColors";

const light: CardColorSet = {
  page: [248, 250, 252],
  surface: [255, 255, 255],
  surfaceSunken: [241, 245, 249],
  text: [30, 41, 59],
  textMuted: [100, 116, 139],
  border: [226, 232, 240],
  agree: [37, 99, 235],
  disagree: [220, 38, 38],
  neutralRaw: [51, 65, 85],
  focus: [37, 99, 235],
};

const dark: CardColorSet = {
  page: [11, 18, 32],
  surface: [27, 39, 64],
  surfaceSunken: [21, 31, 48],
  text: [232, 238, 247],
  textMuted: [148, 163, 184],
  border: [43, 54, 72],
  agree: [44, 108, 238],
  disagree: [203, 70, 63],
  neutralRaw: [203, 213, 225],
  focus: [59, 130, 246],
};

/** Relative luminance, for the contrast assertions below. */
function luminance([r, g, b]: Rgb): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe("parseColor", () => {
  it("reads the three shapes a computed style can come back as", () => {
    expect(parseColor("#fff")).toEqual([255, 255, 255]);
    expect(parseColor("#2563eb")).toEqual([37, 99, 235]);
    expect(parseColor("rgb(37, 99, 235)")).toEqual([37, 99, 235]);
    expect(parseColor("rgba(37 99 235 / 0.5)")).toEqual([37, 99, 235]);
  });

  it("gives up rather than guessing on a colour it cannot read", () => {
    expect(parseColor("oklch(0.6 0.2 260)")).toBeNull();
    expect(parseColor("")).toBeNull();
  });
});

describe("mix", () => {
  it("clamps rather than wrapping past either end", () => {
    expect(mix([0, 0, 0], [255, 255, 255], 2)).toEqual([255, 255, 255]);
    expect(mix([0, 0, 0], [255, 255, 255], -1)).toEqual([0, 0, 0]);
  });
});

describe("cardColorSet", () => {
  it("passes the neutral themes straight through from the live theme", () => {
    expect(cardColorSet("light", { light, dark })).toEqual(light);
    expect(cardColorSet("dark", { light, dark })).toEqual(dark);
  });

  it.each(["agree", "disagree"] as const)("keeps white ink legible on the %s card", (theme) => {
    const colors = cardColorSet(theme, { light, dark });
    expect(colors.text).toEqual([255, 255, 255]);
    expect(contrast(colors.text, colors.page)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(colors.text, colors.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("derives the brand cards from the live theme, not from fixed hexes", () => {
    const green = { ...dark, agree: [22, 163, 74] as Rgb };
    expect(cardColorSet("agree", { light, dark: green }).page).not.toEqual(cardColorSet("agree", { light, dark }).page);
  });
});

describe("css", () => {
  it("only emits an alpha channel when there is one", () => {
    expect(css([1, 2, 3])).toBe("rgb(1 2 3)");
    expect(css([1, 2, 3], 0.5)).toBe("rgb(1 2 3 / 0.5)");
  });
});

describe("cardCssVars", () => {
  it("pins the scheme and every base token the design system derives from", () => {
    const vars = cardCssVars(dark, "dark") as Record<string, string>;
    expect(vars.colorScheme).toBe("dark");
    expect(vars["--ko-color-page"]).toBe("rgb(11 18 32)");
    expect(vars["--ko-color-neutral-ink"]).toBe("rgb(203 213 225)");
    expect(Object.keys(vars)).toHaveLength(11);
  });
});

describe("readActiveColorSet", () => {
  it("falls back to the Czech light palette where the DOM has no tokens to read, and leaves the root's mode as it found it", () => {
    delete document.documentElement.dataset.mode;
    expect(readActiveColorSet("dark")).toEqual(light);
    expect(document.documentElement.dataset.mode).toBeUndefined();

    document.documentElement.dataset.mode = "light";
    readActiveColorSet("dark");
    expect(document.documentElement.dataset.mode).toBe("light");
    delete document.documentElement.dataset.mode;
  });
});
