// Ported from kalkulacka-2026/apps/web/components/app-shell.tsx and app-shell.module.css (the presentational parts only)
import type { ReactNode } from "react";

import { ScrollMode, type ScrollModeValue } from "../client/scrollMode";
import { Backdrop } from "./backdrop";

export type Shell = {
  /**
   * What scrolls on this screen.
   *
   * `document` for anything that is read: its content is then the only thing
   * on the page that can pass under Safari's glass address bar, and a
   * `StickyBar` inside it settles snugly above the bar rather than against
   * `dvh`'s far more pessimistic idea of where the bar starts.
   *
   * `pinned` (the default) is for the question flow, which must not scroll at
   * all — see the document modes in `styles.css` for what each mode does and
   * why.
   */
  scroll?: ScrollModeValue;
  /**
   * The colour wash under the content. On by default; a screen that paints
   * its own background, or one embedded where the wash would clash, turns it
   * off.
   */
  backdrop?: boolean;
  /** The app bar — an `AppHeader`. The menu, embed and theme logic that 2026 wires in here stays in the app. */
  header: ReactNode;
  children: ReactNode;
};

/**
 * Header and backdrop — the frame that does not change between screens.
 *
 * The shell owns the full screen and never scrolls; whatever it wraps decides
 * whether *it* scrolls. That is what lets the question flow (fixed,
 * unscrollable by design) and the content screens (a scrolling list) share one
 * header instead of each rebuilding the chrome around their own layout.
 *
 * `.ko-shell` is `height: 100%`, so it expects an unbroken percentage-height
 * chain from `<body>` — which the document modes in `styles.css` size — the
 * way 2026 gets it as the body's direct child. A layout that wraps the shell
 * in divs of its own has to pass the height down through them.
 *
 * Unlike 2026, where the backdrop sits in the root layout so the wash never
 * restarts mid-flow, the (static, for now) backdrop is mounted here, as the
 * shell's first child. Mounting it in a shared app layout would paint it above
 * the legacy screens that still exist during the port: a fixed `z-index: 0`
 * layer covers non-positioned in-flow content, and only `.ko-shell-content`
 * opts into sitting above it. Moving it to a persistent layout is part of the
 * deferred WebGL backdrop.
 */
export function Shell({ scroll = "pinned", backdrop = true, header, children }: Shell) {
  return (
    <div className="ko-shell">
      {backdrop ? (
        <div className="ko-backdrop-layer" aria-hidden="true">
          <Backdrop />
        </div>
      ) : null}

      <ScrollMode mode={scroll} />

      <div className="ko-shell-content">
        <div className="ko-shell-bar">{header}</div>

        {children}
      </div>
    </div>
  );
}
