// Ported from kalkulacka-2026/packages/ui/src/edge-fade/edge-fade.tsx and edge-fade.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type EdgeFade = {
  /** Which edge of the positioned parent the band covers. */
  edge: NonNullable<VariantProps<typeof EdgeFadeVariants>["edge"]>;
  /**
   * `edge` is a slim reading fade at a list's border; `action` is the taller
   * band a floating control sits in (`--ko-spacing-fade-action`), sized so
   * the fade and the control's clearance stay one number.
   */
  size?: NonNullable<VariantProps<typeof EdgeFadeVariants>["size"]>;
  /** Fades in and out with this; omit it for a band that is always on. */
  visible?: boolean;
};

/*
 * The gradients themselves live in the tokens (`--ko-fade-to-*` in
 * `styles.css`) so this band and the `StickyBar` scrim ramp through identical
 * stops — this only places the band and handles its visibility.
 */
export const EdgeFadeVariants = cva(
  [
    "ko:absolute ko:left-0 ko:right-0 ko:z-2 ko:pointer-events-none",
    "ko:opacity-0 ko:data-visible:opacity-100",
    "ko:transition-opacity ko:duration-(--ko-duration-base) ko:ease-[ease] ko:motion-reduce:transition-none",
  ],
  {
    variants: {
      edge: {
        top: "ko:top-0 ko:bg-(image:--ko-fade-to-bottom)",
        bottom: "ko:bottom-0 ko:bg-(image:--ko-fade-to-top)",
      },
      size: {
        edge: "ko:h-fade-edge",
        action: "ko:h-fade-action",
      },
    },
    defaultVariants: {
      size: "edge",
    },
  },
);

/**
 * The one sanctioned "there is more content this way" treatment: a plain ramp
 * of the page colour over the edge of a scroll area, no blur.
 *
 * Purely decorative overlay — it must sit inside a `position: relative` box
 * that the scroller fills, above the scroller in paint order and transparent
 * to pointers. Every screen with a fading list uses this instead of rolling
 * its own gradient so the fades cannot drift apart again.
 */
export function EdgeFade({ edge, size, visible }: EdgeFade) {
  return <div aria-hidden="true" className={twMerge(EdgeFadeVariants({ edge, size }))} data-visible={visible === false ? undefined : ""} />;
}
