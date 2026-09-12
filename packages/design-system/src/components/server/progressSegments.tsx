// Ported from kalkulacka-2026/packages/ui/src/progress-segments/progress-segments.tsx and progress-segments.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva } from "class-variance-authority";

/** How a single question reads in the progress bar. */
export type SegmentState = "unanswered" | "agree" | "disagree" | "skipped";

export type Segment = {
  state: SegmentState;
  /** Marked "pro mě důležité" — shown as a dot under the segment. */
  important?: boolean;
};

export type ProgressSegmentsProps = {
  segments: Segment[];
  /** Index of the question currently on screen. */
  currentIndex: number;
  /** Accessible label, e.g. "Otázka 3 ze 42". Supplied by the caller. */
  label: string;
};

/* Fixed height so the enlarged current segment does not shift the layout. */
const trackClasses = "ko:flex ko:items-start ko:gap-[3px] ko:h-[17px]";

const segmentClasses = "ko:relative ko:flex-1 ko:min-w-0";

/**
 * The bar itself. Idle is the border colour; the question being answered
 * right now reads as a taller segment in the subtle text colour, and pops in
 * on a keyframe that reduced motion switches off.
 */
export const ProgressSegmentBarVariants = cva(
  ["ko:h-1.5 ko:rounded-[3px] ko:bg-border", "ko:transition-[height,background-color] ko:duration-[var(--ko-duration-slow),var(--ko-duration-base)] ko:ease-[ease]"],
  {
    variants: {
      state: {
        unanswered: "",
        skipped: "",
        agree: "ko:bg-agree",
        disagree: "ko:bg-disagree",
      },
      current: {
        true: "ko:h-[11px] ko:rounded-[5.5px] ko:bg-text-subtle ko:origin-center ko:animate-segment-pop ko:motion-reduce:animate-none",
        false: "",
      },
    },
    defaultVariants: {
      state: "unanswered",
      current: false,
    },
  },
);

/*
 * "Pro mě důležité" — a dot below the segment. Idle-coloured by default (it
 * can be armed before an answer exists, and while skipped), then recoloured to
 * match the bar once an actual position is taken.
 */
export const ProgressSegmentDotVariants = cva(
  ["ko:absolute ko:top-[9px] ko:left-1/2 ko:-translate-x-1/2 ko:size-1 ko:rounded-full ko:bg-border", "ko:transition-[background-color] ko:duration-[var(--ko-duration-base)] ko:ease-[ease]"],
  {
    variants: {
      state: {
        unanswered: "",
        skipped: "",
        agree: "ko:bg-agree",
        disagree: "ko:bg-disagree",
      },
      current: {
        true: "ko:top-[14px]",
        false: "",
      },
    },
    defaultVariants: {
      state: "unanswered",
      current: false,
    },
  },
);

/**
 * One segment per question, coloured by the answer given.
 *
 * Presentational only — it takes an already-derived list rather than answers,
 * so the mapping from domain answers to visual state stays testable in the app.
 *
 * `skipped` reads identically to `unanswered` here — an idle bar, not a third
 * colour. The bar is a progress readout ("how much is decided"), and a skip is
 * not a decision; filling it in would overstate what's actually been settled.
 * `Přeskočit` still exists as an affordance elsewhere (the nav button fills
 * when a question was explicitly passed over) — only this bar declines to draw
 * the distinction.
 */
export function ProgressSegments({ segments, currentIndex, label }: ProgressSegmentsProps) {
  return (
    <div className={trackClasses} role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={segments.length} aria-valuenow={currentIndex + 1}>
      {segments.map((segment, index) => {
        const current = index === currentIndex;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are a fixed positional list.
          <div key={index} className={segmentClasses} aria-hidden="true">
            <div className={twMerge(ProgressSegmentBarVariants({ state: segment.state, current }))} />
            {segment.important ? <span className={twMerge(ProgressSegmentDotVariants({ state: segment.state, current }))} /> : null}
          </div>
        );
      })}
    </div>
  );
}
