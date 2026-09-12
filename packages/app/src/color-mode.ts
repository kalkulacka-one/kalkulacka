// Ported from kalkulacka-2026/apps/web/lib/color-mode.ts — the part a server layout needs. The hook is `client/hooks/use-color-mode.ts`.

/**
 * Where an explicit light/dark choice is kept. Absent until someone toggles
 * it: with no override the page follows `prefers-color-scheme` on its own
 * (`color-scheme: light dark` in the design system's base styles).
 */
export const COLOR_MODE_STORAGE_KEY = "ko-color-mode";

export type ColorMode = "light" | "dark";

/**
 * Runs synchronously, before first paint, as an inline script the app layout
 * places first in `<body>` (`<script dangerouslySetInnerHTML>`, with
 * `suppressHydrationWarning` on `<html>`) — the only way to apply a stored
 * override without a flash of the system's mode first. Stringified into the
 * page rather than imported, so keep it self-contained (no closures over
 * module scope). It lives in this server-safe module rather than next to the
 * hook because a value imported across a `"use client"` boundary reaches a
 * server layout as a client reference, not as the string it is.
 *
 * It writes `theme-color` for the same reason it writes `data-mode`: the tag
 * in the served HTML is a fixed colour, and a browser that reads it before
 * this runs paints its address bar light around a dark page. Deliberately a
 * `content` mutation and not a new tag — the served one is React's, and
 * replacing it here would be a hydration mismatch. The colour is read off a
 * throwaway probe rather than `<html>` itself: the design system paints the
 * root only once the shell's scroll mode has landed, which is after
 * hydration, so at this point the root is still transparent — and the
 * `--ko-color-page` token is a `light-dark()` expression that has to pass
 * through an element to become a colour. `syncBrowserThemeColor` in the hook
 * does exactly the same thing at runtime; the duplication is the price of a
 * script that cannot import anything.
 *
 * The colour is written twice: now, before first paint, and again once the
 * document is parsed. A screen that pins its own scheme from *inside* the
 * body (the Czech app's legacy content pages scope themselves light through
 * `html:has(...)`) does not exist yet when this runs, so the first read sees
 * the root's mode and the second one the page as it will actually paint —
 * and those screens mount no hook that would correct it later.
 */
export const bootstrapColorMode = `
try {
  var m = localStorage.getItem('${COLOR_MODE_STORAGE_KEY}');
  if (m === 'light' || m === 'dark') document.documentElement.dataset.mode = m;

  var sync = function () {
    var p = document.createElement('div');
    p.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden;background-color:var(--ko-color-page)';
    document.body.appendChild(p);
    var c = getComputedStyle(p).backgroundColor;
    p.remove();
    if (c && c !== 'rgba(0, 0, 0, 0)') document.querySelectorAll('meta[name="theme-color"]').forEach(function (t) {
      t.setAttribute('content', c);
    });
  };
  sync();
  document.addEventListener('DOMContentLoaded', sync, { once: true });
} catch (e) {}
`;
