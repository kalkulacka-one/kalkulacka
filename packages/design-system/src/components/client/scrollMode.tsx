"use client";

// Ported from kalkulacka-2026/apps/web/components/scroll-mode.tsx
import { useEffect } from "react";

export type ScrollModeValue = "pinned" | "document";

export type ScrollMode = {
  /**
   * What scrolls on this screen.
   *
   * `document` for anything that is read: its content is then the only thing
   * on the page that can pass under Safari's glass address bar, and a
   * `StickyBar` inside it settles snugly above the bar rather than against
   * `dvh`'s far more pessimistic idea of where the bar starts.
   *
   * `pinned` is for the question flow, which must not scroll at all — see the
   * document modes in `styles.css` for what each mode does and why.
   */
  mode: ScrollModeValue;
};

/**
 * Puts the current screen's scroll mode on `<html>`, where `styles.css` can
 * act on it.
 *
 * It has to be the root element: whether the *document* scrolls is not
 * something a component inside it can decide, and the app's root layout owns
 * `<html>` on every route. Hence an effect rather than markup — and hence this
 * being a component rather than a hook, so the server-rendered `Shell` can drop
 * it in without becoming a client component itself.
 *
 * Both values are written explicitly. The attribute's *absence* means "no
 * new-UI shell on this page", which is what keeps the legacy screens that still
 * exist during the port clear of the document-level rules — and why, unlike
 * 2026, the attribute is removed again on unmount. React runs the outgoing
 * screen's cleanup before the incoming screen's effect, so two shells never
 * fight over it.
 */
export function ScrollMode({ mode }: ScrollMode) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.koScroll = mode;

    return () => {
      delete root.dataset.koScroll;
    };
  }, [mode]);

  /*
   * A second flag, only meaningful in `document` mode: whether the page has
   * moved off its top edge. The sticky header (`.ko-shell-bar` in `styles.css`)
   * reads this to bring in its glass surface only once there is something to
   * separate itself from — at rest, on a page shorter than the screen or
   * freshly loaded, a translucent bar with nothing behind it just draws a hard
   * seam under the wordmark for no reason.
   */
  useEffect(() => {
    if (mode !== "document") return;

    const root = document.documentElement;
    const read = () => {
      // Same 4px dead zone the recap's own top fade uses — enough to ignore
      // the sub-pixel scroll position iOS sometimes reports at rest.
      if (window.scrollY > 4) root.dataset.koHeaderSurface = "";
      else delete root.dataset.koHeaderSurface;
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      delete root.dataset.koHeaderSurface;
    };
  }, [mode]);

  return null;
}
