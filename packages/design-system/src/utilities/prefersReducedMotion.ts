// Ported from kalkulacka-2026/packages/ui/src/prefers-reduced-motion.ts

/**
 * Whether the reader has asked their system for less movement.
 *
 * Most of this design system honours `prefers-reduced-motion` without asking:
 * `styles.css` collapses the duration tokens to nothing under the query, so
 * every transition written in terms of them is already still. This is for the
 * handful of animations that are driven from JavaScript instead — the card deck
 * writes its own `transition` strings as a swipe commits — where there is no
 * token to collapse and the preference has to be read.
 *
 * Read at the moment an animation is about to start rather than cached: the
 * preference can change while the page is open, and every caller is in an event
 * handler or an effect rather than in render, so there is no hydration mismatch
 * to worry about. `false` where there is no `window` — the server, which paints
 * nothing that moves.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
