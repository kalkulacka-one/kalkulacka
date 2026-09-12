// Ported from kalkulacka-2026/packages/ui/src/backdrop/backdrop.tsx and backdrop.module.css (the CSS radial-gradient fallback only)

/**
 * The soft colour wash behind every screen.
 *
 * Only the static CSS gradient is ported for now. In 2026 it is the fallback
 * for when WebGL is unavailable; the animated shader (colours read live from
 * the theme tokens, one still frame under `prefers-reduced-motion`) is
 * deferred, together with moving the layer into a persistent app layout so the
 * wash runs continuously across navigations. The gradient itself lives in
 * `styles.css` (`.ko-backdrop`), mixed from the page, agree, disagree and
 * surface tokens, so a theme re-colours it with no JavaScript at all.
 *
 * Purely decorative: it fills whatever positioned box it is put in and is
 * transparent to pointers. `Shell` mounts it inside `.ko-backdrop-layer`; a
 * story or a screen without a shell can do the same in any
 * `position: relative` box.
 */
export function Backdrop() {
  return <div aria-hidden="true" className="ko-backdrop" />;
}
