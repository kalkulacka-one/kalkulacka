// Ported from kalkulacka-2026/packages/ui/src/share-card/theme-colors.ts
import type { CSSProperties } from "react";

/** An sRGB colour, 0–255 per channel. Canvas, CSS and the swatches all start here. */
export type Rgb = [number, number, number];

/** The themes a share card can be painted in. */
export const CARD_THEMES = ["light", "dark", "agree", "disagree"] as const;
export type CardTheme = (typeof CARD_THEMES)[number];

/**
 * The raw seed colours `styles.css` derives everything else from — the same
 * shape as the `--ko-color-*` base tokens, but resolved to concrete RGB rather
 * than `light-dark()` strings, and with the neutral ink under the name the
 * 2026 colour set gave it (`neutralRaw`, which lands under
 * `--ko-color-neutral-ink` here).
 */
export type CardColorSet = {
  page: Rgb;
  surface: Rgb;
  surfaceSunken: Rgb;
  text: Rgb;
  textMuted: Rgb;
  border: Rgb;
  agree: Rgb;
  disagree: Rgb;
  neutralRaw: Rgb;
  focus: Rgb;
};

const clamp255 = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

/** Linear sRGB blend. `amount` is how far to travel from `from` toward `to`. */
export function mix(from: Rgb, to: Rgb, amount: number): Rgb {
  const t = Math.max(0, Math.min(1, amount));
  return [clamp255(from[0] + (to[0] - from[0]) * t), clamp255(from[1] + (to[1] - from[1]) * t), clamp255(from[2] + (to[2] - from[2]) * t)];
}

/** Parse `#rgb`, `#rrggbb`, `rgb(...)` or `rgba(...)`. `null` when it is none of those. */
export function parseColor(value: string): Rgb | null {
  const text = value.trim();

  const short = text.match(/^#([0-9a-f]{3})$/i);
  if (short?.[1]) {
    const [r, g, b] = short[1];
    return [Number.parseInt(`${r}${r}`, 16), Number.parseInt(`${g}${g}`, 16), Number.parseInt(`${b}${b}`, 16)];
  }

  const hex = text.match(/^#([0-9a-f]{6})$/i);
  if (hex?.[1]) {
    const n = Number.parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  const rgb = text.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
  if (rgb?.[1] && rgb[2] && rgb[3]) {
    return [clamp255(Number(rgb[1])), clamp255(Number(rgb[2])), clamp255(Number(rgb[3]))];
  }

  return null;
}

/** `rgb(r g b)`, optionally with alpha — what an inline style or a canvas fill wants. */
export function css(color: Rgb, alpha = 1): string {
  return alpha >= 1 ? `rgb(${color[0]} ${color[1]} ${color[2]})` : `rgb(${color[0]} ${color[1]} ${color[2]} / ${alpha})`;
}

const WHITE: Rgb = [255, 255, 255];
/** Not black: a hair of blue keeps a red-seeded card from going muddy brown. */
const INK: Rgb = [8, 10, 20];

/**
 * A brand-coloured card's colour set, built from one seed.
 *
 * Rather than hand-picking a fifth and sixth palette, the agree and disagree
 * themes are *derived* from whichever colours the active theme already calls
 * agree and disagree — so a partner theme gets its own two colourways for
 * free, and they cannot drift from the answer buttons they are named after.
 *
 * Dark-forward on purpose: a saturated hue only stays legible under white text
 * once it has been taken most of the way to ink, and a story posted to a phone
 * is looked at in a dark feed more often than not.
 */
function seededColorSet(seed: Rgb, counterpart: Rgb): CardColorSet {
  const page = mix(seed, INK, 0.78);
  // A step *up* from the page toward the seed's own saturation, not toward
  // white — `MatchRow`'s row background is this colour with white text sat
  // directly on it, and white only clears AA (10:1+ here) while the surface
  // stays this dark. Mixing toward white instead (the first attempt) put the
  // surface close enough to the seed's own mid-tone to fail contrast outright.
  const surface = mix(page, seed, 0.4);
  const textMuted = mix(seed, WHITE, 0.72);
  return {
    page,
    surface,
    surfaceSunken: mix(page, seed, 0.15),
    text: WHITE,
    textMuted,
    border: mix(surface, WHITE, 0.3),
    agree: seed,
    disagree: mix(seed, counterpart, 0.6),
    neutralRaw: textMuted,
    focus: seed,
  };
}

/** Build the full colour set for one card theme out of the live theme's tokens. */
export function cardColorSet(theme: CardTheme, live: { light: CardColorSet; dark: CardColorSet }): CardColorSet {
  if (theme === "light") return live.light;
  if (theme === "dark") return live.dark;
  // Both brand cards are seeded from the *dark* palette's agree/disagree: the
  // light palette's exact hues read slightly muddy once pulled this close to
  // ink, the same reason the dark theme brightens them a notch of its own.
  if (theme === "agree") return seededColorSet(live.dark.agree, live.dark.disagree);
  return seededColorSet(live.dark.disagree, live.dark.agree);
}

/** Every card theme but `light` sits on a near-black surface with white ink. */
export function cardColorScheme(theme: CardTheme): "light" | "dark" {
  return theme === "light" ? "light" : "dark";
}

/**
 * The inline style that makes a subtree render in this colour set regardless
 * of the document's own theme.
 *
 * Two separate mechanisms, because the design system's colours are resolved
 * two different ways:
 *
 *  - The `--ko-color-*` base tokens are set outright, and `data-ko-theme-scope`
 *    (set by the layout next to this style) is what tells the derived rules in
 *    `styles.css` — text-strong/subtle, border-strong, the soft/wash/on
 *    colours — to recompute from *these* values instead of inheriting the
 *    ones `:root` already resolved from its own tokens. A custom property
 *    substitutes its `var()`s where it is declared, so an override on a
 *    descendant never reaches a derived token declared on the root.
 *  - `colorScheme` is a real CSS property, not a custom one, and it is what a
 *    genuine `light-dark()` value resolves against — which is exactly what
 *    `MatchRow`'s own per-candidate accent is (`--row-accent`, set inline from
 *    `partyColor`, never touched by any build step since it never appears in
 *    an authored stylesheet). Without this, a dark card rendered while the app
 *    itself is in light mode would still pick every row's *light*-mode accent.
 *
 * Every component in the design system already reads exclusively through
 * `--ko-*` custom properties (or a `light-dark()` value it sets itself), so
 * nothing downstream needs to know this scope exists.
 */
export function cardCssVars(colors: CardColorSet, mode: "light" | "dark"): CSSProperties {
  return {
    colorScheme: mode,
    ["--ko-color-page" as string]: css(colors.page),
    ["--ko-color-surface" as string]: css(colors.surface),
    ["--ko-color-surface-sunken" as string]: css(colors.surfaceSunken),
    ["--ko-color-text" as string]: css(colors.text),
    ["--ko-color-text-muted" as string]: css(colors.textMuted),
    ["--ko-color-border" as string]: css(colors.border),
    ["--ko-color-agree" as string]: css(colors.agree),
    ["--ko-color-disagree" as string]: css(colors.disagree),
    ["--ko-color-neutral-ink" as string]: css(colors.neutralRaw),
    ["--ko-color-focus" as string]: css(colors.focus),
  };
}

/**
 * The tokens read off the DOM, and what to fall back to if one is missing.
 *
 * These hexes are hand-copied from the Czech theme's light palette
 * (`themes/www.volebnikalkulacka.cz/default.css`) — nothing enforces the two
 * staying in sync. Only hit when there is no DOM to probe (server/tests), so
 * drift here is cosmetic rather than a rendering bug, but worth re-checking
 * by hand if that palette changes.
 */
const TOKENS = {
  page: ["--ko-color-page", "#f8fafc"],
  surface: ["--ko-color-surface", "#ffffff"],
  surfaceSunken: ["--ko-color-surface-sunken", "#f1f5f9"],
  text: ["--ko-color-text", "#1e293b"],
  textMuted: ["--ko-color-text-muted", "#64748b"],
  border: ["--ko-color-border", "#e2e8f0"],
  agree: ["--ko-color-agree", "#2563eb"],
  disagree: ["--ko-color-disagree", "#dc2626"],
  neutralRaw: ["--ko-color-neutral-ink", "#334155"],
  focus: ["--ko-color-focus", "#2563eb"],
} as const satisfies Record<keyof CardColorSet, readonly [string, string]>;

const BLACK: Rgb = [0, 0, 0];

/** A constant hex from `TOKENS`; the `?? BLACK` only exists to keep the type honest. */
const fallbackRgb = (hex: string): Rgb => parseColor(hex) ?? BLACK;

/** The colour-space serialisations a browser may report instead of `rgb()`. */
const COLOR_FUNCTION = /^(oklch|oklab|lab|lch|hsl|hwb|color)\(/i;

/**
 * A computed colour serialised in a space `parseColor` cannot read, pushed
 * through a 2D canvas: its `fillStyle` getter serialises every colour back in
 * sRGB. Needed here where 2026 did not: that app's tokens were hex, whereas a
 * theme in this design system may derive a token in `oklch()` (the default
 * theme does for every surface), and Chrome then reports the computed `color`
 * as `oklch(...)` rather than `rgb(...)`. Only a colour function is worth the
 * trip — anything else (jsdom hands the `var()` back unresolved) is not a
 * colour the canvas could read either.
 */
function normalizeViaCanvas(value: string): Rgb | null {
  if (!COLOR_FUNCTION.test(value.trim())) return null;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return null;
  context.fillStyle = value;
  return parseColor(context.fillStyle);
}

/**
 * The active theme's own raw seeds, resolved for one light/dark mode.
 *
 * Two things make this less direct than reading the tokens off `<html>`:
 *
 *  - **Why a probe element rather than `getPropertyValue`.** A custom property
 *    read straight back is its *authored* text, which for a `light-dark()`
 *    token is something like `light-dark(#f8fafc, #0b1220)` — not a colour.
 *    Assigning it to a real property and reading *that* back makes the browser
 *    resolve it, and `color` always comes back as a concrete colour.
 *
 *  - **Why the root's mode is flipped rather than the probe's.** The mode is
 *    the root's to decide: `styles.css` keys `color-scheme` off `data-mode`
 *    there, and a single-mode partner theme pins it back over that attribute —
 *    a probe forced dark under such a theme would read a dark palette nobody
 *    authored. Writing `data-mode` on the root is therefore the lever that
 *    respects every theme, and it is restored before this returns. Nothing
 *    paints in between — style recalculation is synchronous, rendering is not.
 *
 * Reads live off the DOM rather than importing a theme object, so a partner
 * brand applied at runtime is picked up without this knowing any theme names.
 */
export function readActiveColorSet(mode: "light" | "dark"): CardColorSet {
  const fallback = () => Object.fromEntries(Object.entries(TOKENS).map(([key, [, hex]]) => [key, fallbackRgb(hex)])) as CardColorSet;

  if (typeof document === "undefined") return fallback();

  const root = document.documentElement;
  const previousMode = root.dataset.mode;
  root.dataset.mode = mode;

  const probe = document.createElement("div");
  probe.style.position = "fixed";
  probe.style.top = "0";
  probe.style.left = "0";
  probe.style.width = "0";
  probe.style.height = "0";
  probe.style.pointerEvents = "none";
  probe.setAttribute("aria-hidden", "true");
  document.body.appendChild(probe);

  try {
    const read = (token: string, hex: string): Rgb => {
      probe.style.color = "";
      probe.style.color = `var(${token}, ${hex})`;
      const computed = getComputedStyle(probe).color;
      return parseColor(computed) ?? normalizeViaCanvas(computed) ?? fallbackRgb(hex);
    };

    return Object.fromEntries(Object.entries(TOKENS).map(([key, [token, hex]]) => [key, read(token, hex)])) as CardColorSet;
  } finally {
    probe.remove();
    if (previousMode === undefined) delete root.dataset.mode;
    else root.dataset.mode = previousMode;
  }
}

/** Both modes at once — what every card theme is ultimately built from. */
export function readActiveColorSets(): { light: CardColorSet; dark: CardColorSet } {
  return { light: readActiveColorSet("light"), dark: readActiveColorSet("dark") };
}
