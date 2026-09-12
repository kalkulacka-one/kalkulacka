// Ported from kalkulacka-2026/packages/ui/src/party-color.ts

/**
 * A stable accent colour per candidate, so the same party reads as the same
 * colour everywhere it appears in a ranking — the match bar and the avatar's
 * ring share this rather than each guessing independently.
 *
 * Priority order, resolved by the caller and handed in as `dataColor`:
 * authored in the source data, else derived server-side from the logo
 * (2026's `apps/web/lib/logo-color.ts`, run once per calculator load and
 * cached), else this module's own hash palette.
 *
 * The hash palette used to be the only option, precisely because reading the
 * logo *client-side* doesn't work: most marks are transparent or
 * white-on-white PNGs, fetched from a CDN rather than this origin, so pulling
 * a dominant colour out of them in the browser means a canvas read that's
 * async, sometimes CORS-blocked, and still wrong for a monochrome mark.
 * Deriving it on the server sidesteps all three — the fetch has no CORS
 * concern, it runs once at calculator-load time rather than once per visit,
 * and a mark with no real colour in it (checked directly, not guessed from
 * pixels a browser already decoded) is left `undefined` there too. This
 * module's job is unchanged: a name-seeded pick from a fixed palette, instant
 * and always available, for whatever's left over.
 */
const PALETTE = [
  "light-dark(#2563eb, #3b82f6)", // blue
  "light-dark(#7c3aed, #a78bfa)", // violet
  "light-dark(#0d9488, #2dd4bf)", // teal
  "light-dark(#d97706, #fbbf24)", // amber
  "light-dark(#db2777, #f472b6)", // pink
  "light-dark(#059669, #34d399)", // emerald
  "light-dark(#4f46e5, #818cf8)", // indigo
  "light-dark(#ea580c, #fb923c)", // orange
  "light-dark(#0891b2, #22d3ee)", // cyan
  "light-dark(#65a30d, #a3e635)", // lime
];

const FALLBACK = PALETTE[0] as string;

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(result);
}

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };

const HEX_PATTERN = /^#(?:([0-9a-fA-F]{3})|([0-9a-fA-F]{6}))$/;

function parseHex(hex: string): Rgb | undefined {
  const match = HEX_PATTERN.exec(hex);
  if (!match) return undefined;
  const full = match[2] ?? (match[1] as string).replace(/(.)/g, "$1$1");
  const value = Number.parseInt(full, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0");
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;

  return { h: h * 60, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToChannel = (t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const hn = h / 360;
  return {
    r: hueToChannel(hn + 1 / 3) * 255,
    g: hueToChannel(hn) * 255,
    b: hueToChannel(hn - 1 / 3) * 255,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Where a light-theme card keeps its accent legible against a near-white surface. */
const LIGHT_LIGHTNESS_MIN = 0.35;
const LIGHT_LIGHTNESS_MAX = 0.55;
/** Where a dark-theme card keeps its accent legible against a near-black one. */
const DARK_LIGHTNESS_MIN = 0.55;
const DARK_LIGHTNESS_MAX = 0.72;

/**
 * A party's own colour, clamped into the same readable band the hand-picked
 * palette above already occupies — same hue and saturation, lightness pulled
 * into range for each theme independently. A party can hand this a colour
 * that's unreadable on its own (near-white, near-black, too washed out); it
 * can't hand the UI one that comes out that way.
 */
function normalizeDataColor(hex: string): string | undefined {
  const rgb = parseHex(hex);
  if (!rgb) return undefined;

  const hsl = rgbToHsl(rgb);
  const light = hslToRgb({ ...hsl, l: clamp(hsl.l, LIGHT_LIGHTNESS_MIN, LIGHT_LIGHTNESS_MAX) });
  const dark = hslToRgb({ ...hsl, l: clamp(hsl.l, DARK_LIGHTNESS_MIN, DARK_LIGHTNESS_MAX) });
  return `light-dark(${rgbToHex(light)}, ${rgbToHex(dark)})`;
}

/**
 * A `light-dark()` colour for a candidate. `dataColor` — the source's own
 * colour, or one derived server-side from the logo — wins when present and
 * parses; otherwise a `light-dark()` pick made deterministically from `seed`
 * (typically the candidate's name).
 */
export function partyColor(seed: string, dataColor?: string): string {
  if (dataColor) {
    const normalized = normalizeDataColor(dataColor);
    if (normalized) return normalized;
  }
  return PALETTE[hash(seed) % PALETTE.length] ?? FALLBACK;
}
