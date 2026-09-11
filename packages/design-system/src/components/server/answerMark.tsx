// Ported from kalkulacka-2026/packages/ui/src/answer-mark/answer-mark.tsx and answer-mark.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

import { Icon } from "../client/icon";
import { type IconName, icons } from "../icons";

/**
 * Which of the answer colours the mark wears.
 *
 * Deliberately not the domain's `true | false | null | undefined` — the design
 * system knows about tones, and the app decides which tone an answer maps to.
 * `none` is the absence of a position; `neutral` is an explicit "nevím", which
 * is a real answer that simply takes no side.
 */
export type AnswerMarkTone = "agree" | "disagree" | "neutral" | "none";

type AnswerMarkSize = NonNullable<VariantProps<typeof AnswerMarkVariants>["size"]>;

export type AnswerMark = {
  tone: AnswerMarkTone;
  /**
   * The accessible name, read in place of the shape, e.g. "Ano".
   *
   * Omit it only where the mark is genuinely decorative and something around it
   * already carries the meaning — the calculating screen's film strip is the one
   * such place. Anywhere a mark *is* the statement of an answer, it needs this:
   * without it the row says nothing at all to a screen reader.
   */
  label?: string;
  /** `small` for a dense comparison row, `medium` for a recap row. */
  size?: AnswerMarkSize;
  className?: string;
};

export const AnswerMarkVariants = cva(
  ["ko:inline-flex ko:items-center ko:justify-center ko:flex-none", "ko:rounded-pill", "ko:transition-[background-color] ko:duration-[var(--ko-duration-base)] ko:ease-[ease]"],
  {
    variants: {
      tone: {
        /*
         * Fixed white ink on the filled marks, in every theme — not the derived
         * `on-agree` / `on-disagree` tokens the card's own buttons use, which flip
         * to near-black once a theme's accent gets light enough (the dark theme's
         * brighter blue/red). That flip reads as the icon *inverting* between
         * themes; a small filled mark has no room for that kind of surprise, so
         * the ink is pinned rather than computed.
         */
        agree: "ko:bg-agree ko:text-white",
        disagree: "ko:bg-disagree ko:text-white",
        /*
         * An explicit "nevím". Filled like a real answer, because it is one — but
         * in the neutral ink, so it reads as a position without a direction rather
         * than as a third opinion competing with the two that have one.
         */
        neutral: "ko:bg-neutral-ink ko:text-white",
        /*
         * No answer — a dashed ring, whether the question was explicitly skipped
         * or simply never reached. Neither screen acts on that distinction, so
         * neither draws one.
         */
        none: "ko:bg-transparent ko:border-[1.5px] ko:border-dashed ko:border-text-muted/50",
      },
      size: {
        small: "ko:size-6",
        medium: "ko:size-[2.125rem]",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

const ICONS: Record<AnswerMarkTone, IconName | undefined> = {
  agree: "check",
  disagree: "cross",
  neutral: "neutral",
  none: undefined,
};

/*
 * Icon height in px, as the prototype sized its marks; the width follows each
 * mark's own aspect ratio. Icon's square sizes are switched off (`size={null}`)
 * so these are the only dimensions on the SVG.
 */
const ICON_CLASSES: Record<AnswerMarkSize, string> = {
  small: "ko:h-[9px] ko:w-auto",
  medium: "ko:h-[11px] ko:w-auto",
};

/**
 * A recorded position, as a single circle.
 *
 * The heavy marks the question card's own answer buttons use, at reading scale
 * — a row wearing one of these is a compressed reading of that card, not a
 * different visual language for the same two answers. Introduced by the recap
 * and shared with the results comparison so the two screens agree on what a
 * "yes" looks like.
 *
 * With a `label` the mark is an image named by it; without one it is hidden
 * from assistive tech altogether.
 */
export function AnswerMark({ tone, label, size = "medium", className }: AnswerMark) {
  const icon = ICONS[tone];
  const classes = twMerge(AnswerMarkVariants({ tone, size }), className);
  const shape = icon ? <Icon icon={icons[icon]} size={null} decorative className={ICON_CLASSES[size]} /> : null;

  if (label) {
    return (
      <span className={classes} role="img" aria-label={label}>
        {shape}
      </span>
    );
  }

  return (
    <span className={classes} aria-hidden="true">
      {shape}
    </span>
  );
}
