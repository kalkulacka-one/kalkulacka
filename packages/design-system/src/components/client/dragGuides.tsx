"use client";

// Ported from kalkulacka-2026/packages/ui/src/drag-guides/drag-guides.tsx and drag-guides.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva } from "class-variance-authority";

import { type IconDefinition, icons } from "../icons";
import { Icon } from "./icon";

/**
 * Where a card can be dragged, named as compass points.
 *
 * The diagonals are an answer *plus* "pro mě důležité" — the same swipe, lifted.
 * There is no north on its own: an upward drag that goes nowhere sideways
 * commits nothing.
 */
export type DragDirection = "nw" | "w" | "ne" | "e" | "s";

export const DRAG_DIRECTIONS: readonly DragDirection[] = ["nw", "w", "ne", "e", "s"] as const;

export type DragGuidesLabels = {
  agree: string;
  disagree: string;
  important: string;
  skip: string;
};

export type DragGuidesProps = {
  labels: DragGuidesLabels;
  /**
   * The desktop reading: diagonals split into two straight icons (an upward
   * arrow, then the answer's own arrow) instead of one arrow on the
   * diagonal, and every pill spells its direction out in words.
   *
   * Both are a room budget, not a taste: this card lives in a fixed-width
   * reading column, so "wide enough" never arrives from a bigger window the
   * way it does for the card's own answer-button labels — it has to come
   * from somewhere else, and the same signal that already tells the tutorial
   * apart by pointer is the one this reuses. On a touch-sized card the
   * pills stay icon-only; five of them carrying a word each is more text
   * than the statement above has room to share the card with.
   */
  split?: boolean;
  /** Directions already tried, which fade back to leave the untried ones lit. */
  practised?: ReadonlySet<DragDirection>;
  /** Where the drag under the pointer right now would commit. */
  active?: DragDirection | null;
};

/*
 * The band the pills live in: the card's own padding, minus the action row at
 * the bottom. Inset from the card's text rather than laid over it — the pills
 * hug the edges, so a statement wrapping to two lines still has the middle of
 * the card to itself.
 *
 * `top` used to clear a chips row this card no longer has (the only card
 * `DragGuides` is ever drawn over); it now sits flush with the same inset the
 * other three edges use.
 *
 * Above the statement in front of it, not behind it (`z-1`): a labelled pill
 * on a short statement can reach past where the centred text starts, and a
 * pill that loses that overlap to the text it is meant to be legible over
 * would defeat the fix its own background exists for.
 */
const guidesClasses = [
  "ko:absolute ko:top-2 ko:right-2 ko:left-2 ko:z-1",
  "ko:bottom-[calc(var(--ko-spacing-fluid-card-pad-bottom)_+_var(--ko-spacing-fluid-action)_+_0.5rem)]",
  "ko:pointer-events-none",
].join(" ");

/**
 * Same bordered-pill language as "Přeskočit" below the card (`Button`'s
 * `plate` variant): a real container, not a bare icon — that pill is legible
 * at a glance, and the arrows were not. Solid rather than translucent: this
 * sits on the card's own opaque surface, not over the animated backdrop, so
 * there is nothing behind it worth blurring.
 */
export const DragGuideVariants = cva(
  [
    "ko:absolute ko:flex ko:items-center ko:gap-[0.3125rem]",
    "ko:px-2.5 ko:py-1.5 ko:rounded-pill ko:bg-surface ko:text-text-muted",
    "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
    "ko:transition-[color,background-color,box-shadow,opacity,scale]",
    "ko:duration-[var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-base),var(--ko-duration-fast)]",
    "ko:ease-[ease,ease,ease,ease,var(--ko-ease-spring)]",
  ],
  {
    variants: {
      /*
       * Where each one sits. The bottom row is bottom-anchored, not vertically
       * centred: the card's body centres its text in this same band, so a
       * mid-height pill sits exactly on top of the one line every short
       * statement collapses to. The bottom of the band is the one point in it
       * a centred block of text never reaches — and it happens to float the
       * pill just above the very button the same drag answers.
       */
      direction: {
        nw: "ko:top-0 ko:left-0",
        ne: "ko:top-0 ko:right-0",
        w: "ko:bottom-0 ko:left-0",
        e: "ko:bottom-0 ko:right-0",
        s: "ko:bottom-0 ko:left-1/2 ko:-translate-x-1/2",
      },
      /*
       * Already tried, so it steps back — the point of the compass after the
       * first swipe is the directions that are still news.
       */
      practised: {
        true: "ko:opacity-45",
        false: "",
      },
      /*
       * Lit by the drag that is currently pointing at it — filled solid, the
       * same treatment `FlowNav` gives an explicitly skipped question, not a
       * colour tied to the answer. The lift is the one part that moves on its
       * own, so it is the one part reduced motion takes away.
       */
      active: {
        true: "ko:opacity-100 ko:scale-[1.08] ko:motion-reduce:scale-100 ko:bg-neutral-ink ko:text-on-neutral-ink ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-neutral-ink)]",
        false: "",
      },
    },
    defaultVariants: {
      practised: false,
      active: false,
    },
  },
);

const iconsClasses = "ko:flex ko:flex-none ko:items-center ko:gap-0.5";

/* Only rendered at all when `split` is on — see the prop's own comment. */
const labelClasses = "ko:font-sans ko:text-xs ko:font-semibold ko:tracking-[-0.01em] ko:whitespace-nowrap";

type GuideIcon = { icon: IconDefinition; rotation?: 45 | 135 };

const rotationClasses = { 45: "ko:rotate-45", 135: "ko:rotate-[135deg]" } as const;

/** What to draw and what to say, for one direction. */
function guideFor(direction: DragDirection, split: boolean, labels: DragGuidesLabels): { icons: GuideIcon[]; label: string } {
  switch (direction) {
    case "w":
      return { icons: [{ icon: icons.arrowLeft }], label: labels.agree };
    case "e":
      return { icons: [{ icon: icons.arrowRight }], label: labels.disagree };
    case "s":
      return { icons: [{ icon: icons.arrowDown }], label: labels.skip };
    case "nw":
      return {
        icons: split ? [{ icon: icons.arrowUp }, { icon: icons.arrowLeft }] : [{ icon: icons.arrowLeft, rotation: 45 }, { icon: icons.starThin }],
        label: labels.important,
      };
    case "ne":
      return {
        icons: split ? [{ icon: icons.arrowUp }, { icon: icons.arrowRight }] : [{ icon: icons.arrowLeft, rotation: 135 }, { icon: icons.starThin }],
        label: labels.important,
      };
  }
}

/**
 * The compass drawn inside the practice card.
 *
 * A first-time reader's difficulty is not that dragging is hard, it is that
 * nothing about a card says it can be dragged at all. So the directions are
 * drawn where they are: labelled pills hugging the card's edges — the same
 * bordered-pill language as "Přeskočit" below the card, not a bare icon that
 * reads as decoration — lighting up as the drag reaches them.
 *
 * Colour is neutral rather than tied to the answer (no green/red): five
 * tinted marks in a 300px card competed with each other and with the card's
 * own agree/disagree buttons for the reader's eye. What *is* dragged toward
 * lights up with a filled neutral pill instead, the same treatment `FlowNav`
 * gives an explicitly skipped question.
 *
 * Decorative: `aria-hidden`, no pointer events. Every direction is also a
 * button on the card and a sentence in the help overlay, so nothing is lost by
 * not putting these in the tab order.
 */
export function DragGuides({ labels, split = false, practised, active = null }: DragGuidesProps) {
  return (
    <div className={guidesClasses} aria-hidden="true">
      {DRAG_DIRECTIONS.map((direction) => {
        const { icons: glyphs, label } = guideFor(direction, split, labels);

        return (
          <span key={direction} data-direction={direction} className={twMerge(DragGuideVariants({ direction, practised: practised?.has(direction) ?? false, active: active === direction }))}>
            <span className={iconsClasses}>
              {glyphs.map(({ icon, rotation }, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed, order-stable pair per direction — nothing here is ever reordered or filtered.
                <Icon key={index} icon={icon} size="xsmall" decorative className={rotation ? rotationClasses[rotation] : undefined} />
              ))}
            </span>
            {split ? <span className={labelClasses}>{label}</span> : null}
          </span>
        );
      })}
    </div>
  );
}
