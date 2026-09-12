// Ported from kalkulacka-2026/packages/ui/src/sticky-bar/sticky-bar.tsx and sticky-bar.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

export type StickyBar = {
  children: ReactNode;
  /** `flat` reads as part of the page rather than a floating layer over it. */
  variant?: NonNullable<VariantProps<typeof StickyBarVariants>["variant"]>;
};

/*
 * Stacked on a phone, side by side from `xs` (34rem) up — and which action
 * leads flips with it. Two Czech labels don't fit one line below roughly
 * 26–31rem (content-driven, so it moves with whatever the labels actually
 * are), which is what `flex-wrap` alone used to handle; but reading order
 * needs to flip with the *same* switch reordering can't hook to (there is no
 * CSS "did this actually wrap" query), so the wrap is now a deliberate
 * breakpoint instead, set comfortably above the widest measured natural wrap
 * point rather than pinned to it — a `min-width` here that undershoots would
 * fix one language's button lengths and re-break the layout for a longer one.
 *
 * Primary leads stacked — top-to-bottom, "what happens" before "the other
 * option" — while the secondary stays visually first in the DOM (a screen
 * reader or a Tab press meets it in that order regardless of the breakpoint,
 * which is exactly why this is a visual `order`, not a markup reorder). Row
 * layout puts the secondary back on the left — the conventional placement
 * once there's room to read the pair left-to-right instead of top-to-bottom.
 *
 * The bar sticks to the bottom of the layout viewport, which on a phone is a
 * few pixels above the browser's floating address bar — so the bottom margin
 * is breathing room, not clearance. The inset only has a value where the bar
 * is absent and the hardware's own is exposed instead (an installed PWA).
 */
export const StickyBarVariants = cva(
  [
    "ko:sticky ko:bottom-0 ko:z-4",
    "ko:flex ko:flex-col ko:xs:flex-row ko:items-center ko:justify-center ko:flex-wrap ko:gap-3",
    "ko:py-4 ko:mb-[max(0.5rem,env(safe-area-inset-bottom,0px))]",
    "ko:[&>:last-child]:order-first ko:xs:[&>:last-child]:order-none",
  ],
  {
    variants: {
      variant: {
        /*
         * No panel behind the actions — each one floats on its own.
         *
         * The earlier 2026 version wrapped the buttons in a translucent,
         * bordered plate, on the reasoning that the pair needed a shared
         * boundary to read as chrome over the animated backdrop. In practice
         * the plate was the odd element: a solid button already has its own
         * opaque pill and needs nothing behind it, and the one thing genuinely
         * relying on the plate was a `ghost` button whose own background is
         * transparent — which is a reason to give *that* button real chrome
         * (`plate`, the variant built for exactly this), not a reason to wrap
         * both of them in a second, redundant one.
         *
         * What the plate still owned is a floating shadow, so each action
         * stays legible over content sliding past underneath it — that moves
         * to the buttons themselves rather than disappearing. The phone scrim
         * behind them is `.ko-sticky-bar-floating` in `styles.css`.
         */
        floating: "ko-sticky-bar-floating ko:[&>*]:shadow-card-back",
        /*
         * Reads as part of the page rather than chrome floating over it — so,
         * unlike `floating`, its children get no shadow of their own. Stated
         * explicitly rather than left as the (identical) unstyled default, so
         * a future person adding a shadow to `floating` doesn't have to also
         * remember this variant exists to *not* pick it up.
         */
        flat: "ko:[&>*]:shadow-none",
      },
    },
    defaultVariants: {
      variant: "floating",
    },
  },
);

/**
 * The pinned action strip at the bottom of a scrolling screen.
 *
 * Sticky rather than fixed, so it participates in its scroll container's
 * layout and cannot end up overlapping the last list item — the usual failure
 * of a fixed bar over a list whose padding nobody remembered to grow.
 */
export function StickyBar({ children, variant }: StickyBar) {
  return <div className={twMerge(StickyBarVariants({ variant }))}>{children}</div>;
}
