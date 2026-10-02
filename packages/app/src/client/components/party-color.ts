/**
 * A stable accent colour per candidate, name-seeded so the same party reads as
 * the same colour everywhere it appears in a ranking — the match bar, the
 * avatar's ring and the initials tint all share this rather than each
 * guessing independently.
 *
 * Ported from kalkulacka-2026's `packages/ui/src/party-color.ts`. That
 * version also accepts a colour authored in the source data, or one derived
 * server-side from the logo, ahead of this seeded fallback — this repo's
 * schema carries neither (and sampling a logo client-side doesn't work
 * reliably: most marks are transparent or white-on-white PNGs fetched from a
 * CDN), so only the always-available seeded-palette part is ported.
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
] as const;

const FALLBACK: string = PALETTE[0];

function hash(value: string): number {
  let result = 0;
  for (let i = 0; i < value.length; i++) {
    result = (result * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(result);
}

/**
 * A `light-dark()` colour for a candidate, picked deterministically from
 * `seed` (typically the candidate's name) — the same seed always yields the
 * same colour, instantly and with no network or image work involved.
 */
export function partyColor(seed: string): string {
  return PALETTE[hash(seed) % PALETTE.length] ?? FALLBACK;
}
