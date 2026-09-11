// Ported from kalkulacka-2026/apps/web/components/screen.tsx and screen.module.css
import type { ReactNode } from "react";

import { Shell } from "./shell";

export type Screen = {
  title: string;
  description?: string;
  /**
   * The way back, above the title. A node rather than a href so the app can
   * pass a `Button` with `variant="plate"` and `iconStart={icons.chevronLeftThin}`
   * (or a real anchor, so it can be opened in a new tab).
   */
  back?: ReactNode;
  /** The app bar — an `AppHeader`. */
  header: ReactNode;
  children: ReactNode;
  /** Pinned to the bottom of the scroll area. Pass a `StickyBar`. */
  footer?: ReactNode;
};

/**
 * The shell every screen except the question flow uses.
 *
 * The flow is deliberately unscrollable — the deck fills the viewport and iOS
 * elastic bounce is pinned away at the document level in `styles.css`. Every
 * other screen has a list that must scroll, and it is the *document* that
 * scrolls for them (`scroll="document"`): an inner container was tidier, but
 * it is also the one arrangement iOS will not let paint under its glass
 * address bar, and it pins a `StickyBar` to `dvh` instead of to the bar
 * itself.
 */
export function Screen({ title, description, back, header, children, footer }: Screen) {
  return (
    <Shell scroll="document" header={header}>
      <main className="ko-screen">
        <div className="ko-screen-inner ko:flex-1 ko:flex ko:flex-col ko:gap-6 ko:w-full ko:max-w-[42rem] ko:mx-auto ko:pt-4 ko:lg:pt-8 ko:pl-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-left,0px))] ko:pr-[calc(var(--ko-spacing-fluid-gutter)+env(safe-area-inset-right,0px))]">
          {/* `gap-3` keeps the title and its description reading as one unit; a
              back link above them gets its extra clearance from
              `.ko-screen-title:not(:first-child)`, so the chip stops crowding
              the headline it has no relation to. */}
          <header className="ko:flex ko:flex-col ko:gap-3">
            {back}

            <h1 className="ko-screen-title ko:font-display ko:text-display ko:font-bold ko:tracking-[-0.045em] ko:text-text ko:text-balance">{title}</h1>
            {description ? <p className="ko:max-w-[34rem] ko:font-sans ko:text-lg ko:leading-[1.55] ko:text-text-muted ko:text-pretty">{description}</p> : null}
          </header>

          {children}

          {/*
           * The bar's cage — and it has to be a big one.
           *
           * `StickyBar` is `position: sticky; bottom: 0`, but a sticky element
           * can only travel inside its own containing block, and a wrapper
           * that is exactly the bar's own height gives it nowhere to go: it
           * never pinned on any screen. Putting `sticky` on this wrapper fixes
           * it, because *its* containing block is the inner column, which
           * spans the whole document. The bar inside keeps its own sticky
           * declaration — inert here, still load-bearing where the same
           * component is laid out on its own.
           *
           * On a phone `margin-top: auto` keeps the bar at the bottom of a
           * short screen, within thumb reach. On a desktop the column is
           * content-height and the bar sits under the content instead,
           * sticking to the viewport edge only while the page overflows.
           */}
          {footer ? <div className="ko:mt-auto ko:sticky ko:bottom-0 ko:z-4">{footer}</div> : null}
        </div>
      </main>
    </Shell>
  );
}
