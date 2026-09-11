"use client";

// Ported from kalkulacka-2026/packages/ui/src/flow-nav/flow-nav.tsx and flow-nav.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { Button as ButtonHeadless } from "@headlessui/react";
import { cva } from "class-variance-authority";

import { icons } from "../icons";
import { VisuallyHidden } from "../server/visuallyHidden";
import { ButtonVariants } from "./button";
import { Icon } from "./icon";

export type FlowNavProps = {
  /** 1-based position of the question on screen. */
  position: number;
  total: number;
  onPrevious: () => void;
  /** Advances — skipping the question if it has no answer yet. */
  onForward: () => void;
  canGoBack: boolean;
  /**
   * The forward control reads as "Další" once an answer exists and
   * "Přeskočit" while it does not.
   */
  forwardLabel: string;
  previousLabel: string;
  /** Highlight the control because this question was explicitly skipped. */
  isSkipped?: boolean;
  /**
   * Highlight the control because the answer was just cleared — re-tapping an
   * already-chosen position, which leaves the question unanswered again right
   * as someone is looking at it. A transient nudge toward "Přeskočit" rather
   * than `isSkipped`'s persisted state.
   */
  attention?: boolean;
  /** e.g. "Otázka 3 ze 42", for assistive tech. */
  counterLabel: string;
};

/*
 * `flex: none` in the flow's column, which must never scroll. Three columns
 * with the middle one sized to its content, so the counter is centred on the
 * row itself and not between two labels of unequal width ("Návod" on the
 * first question is a good deal shorter than "Předchozí").
 */
const navClasses = "ko:flex-none ko:grid ko:grid-cols-[1fr_auto_1fr] ko:items-center ko:h-fluid-nav";

/**
 * The two controls, either side of the counter.
 *
 * Built on `Button`'s ghost pill — its hover wash, press, focus ring,
 * transition and disabled handling — at the nav's own spacing and type: the
 * 2026 "lead" size (1.0625rem), bold, in the neutral ink rather than the body
 * text. The pill's horizontal padding is cancelled by a negative margin on the
 * outer side, so the *label* lines up with the card's edge above and the
 * pill's wash overhangs it on hover; the counter has no such wash and stays
 * where it is.
 */
export const FlowNavButtonVariants = cva(
  [
    ButtonVariants({ variant: "ghost", size: "small" }),
    "ko:px-3.5 ko:py-[0.4375rem]",
    "ko:text-neutral-ink ko:text-[1.0625rem] ko:font-bold",
    /*
     * The source's disabled look: the subtle text colour at full opacity, not
     * `Button`'s 45% fade — a faded bold label next to a strong counter read
     * as broken, where a quieter colour reads as "nowhere to go".
     */
    "ko:data-disabled:text-text-subtle ko:data-disabled:opacity-100",
  ],
  {
    variants: {
      placement: {
        previous: "ko:justify-self-start ko:-ml-3.5",
        forward: "ko:justify-self-end ko:-mr-3.5",
      },
      /*
       * An explicitly skipped question keeps the control filled, as a
       * reminder — the same solid neutral `Button` uses, and the same fill
       * `DragGuides` lights the pill a drag is pointing at with.
       */
      skipped: {
        true: "ko:bg-neutral-ink ko:text-on-neutral-ink ko:data-hover:bg-neutral-ink/90 ko:data-active:bg-neutral-ink/80",
        false: "",
      },
    },
    defaultVariants: {
      skipped: false,
    },
  },
);

/* The lead size again, in the subtle colour, so the numbers sit as quietly as the labels either side are loud. */
const counterClasses = "ko:justify-self-center ko:m-0 ko:font-sans ko:text-[1.0625rem] ko:tracking-[-0.01em] ko:text-text-subtle ko:tabular-nums";

const positionClasses = "ko:font-bold ko:text-text-strong";

/**
 * The row under the deck: back, the counter, forward.
 *
 * "Forward" rather than "next" because it does two jobs — advancing past an
 * answered question and skipping an unanswered one — and the caller passes
 * whichever label is true right now. The counter is drawn as digits and read
 * as a sentence: the visible `3/42` is `aria-hidden` and `counterLabel`
 * carries the spoken form, so a screen reader hears "Otázka 3 ze 42" rather
 * than "three slash forty-two".
 */
export function FlowNav({ position, total, onPrevious, onForward, canGoBack, forwardLabel, previousLabel, isSkipped = false, attention = false, counterLabel }: FlowNavProps) {
  return (
    <nav className={navClasses}>
      {/* Disabled rather than hidden at the start: the row keeps its shape, and the counter stays centred. */}
      <ButtonHeadless type="button" className={twMerge(FlowNavButtonVariants({ placement: "previous" }))} onClick={onPrevious} disabled={!canGoBack}>
        <Icon icon={icons.chevronLeftThin} size="xsmall" decorative />
        <span>{previousLabel}</span>
      </ButtonHeadless>

      <p className={counterClasses}>
        <VisuallyHidden>{counterLabel}</VisuallyHidden>
        <span aria-hidden="true">
          <strong className={positionClasses}>{position}</strong>/{total}
        </span>
      </p>

      <ButtonHeadless type="button" className={twMerge(FlowNavButtonVariants({ placement: "forward", skipped: isSkipped || attention }))} onClick={onForward}>
        <span>{forwardLabel}</span>
        <Icon icon={icons.chevronRightThin} size="xsmall" decorative />
      </ButtonHeadless>
    </nav>
  );
}
