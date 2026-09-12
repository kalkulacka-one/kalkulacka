// Ported from kalkulacka-2026/packages/ui/src/donut/donut.tsx and donut.module.css, with the
// legend from kalkulacka-2026/apps/web/components/results-dashboard.tsx (`.legend*`, `.swatch`)
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva } from "class-variance-authority";

/** The same four tones as the answer marks, so the ring reads against the recap without a key. */
export type DonutTone = "agree" | "disagree" | "neutral" | "none";

export type DonutSegment = {
  tone: DonutTone;
  value: number;
  label: string;
};

export type Donut = {
  segments: DonutSegment[];
  /** The figure in the hole — usually the total. */
  centerValue: string;
  /** Its caption, e.g. "otázek". */
  centerLabel: string;
  /** Outer diameter in px. */
  size?: number;
  className?: string;
};

const RADIUS = 40;
export const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Units of arc dropped between segments so two adjacent colours stay legible. */
export const GAP = 3;

/*
 * The ring's four inks. `none` — unanswered — reads as absence without
 * disappearing: at 0.28 it was all but invisible on the dark theme, where the
 * muted ink is already close to the surface behind it, and a segment nobody
 * can see is a share of the whole silently unaccounted for. The legend's
 * swatches wear the same four, so the key can't drift from the ring it
 * explains.
 */
export const DonutSegmentVariants = cva("", {
  variants: {
    tone: {
      agree: "ko:stroke-agree",
      disagree: "ko:stroke-disagree",
      neutral: "ko:stroke-neutral-ink",
      none: "ko:stroke-text-muted/55",
    },
  },
});

export const DonutSwatchVariants = cva("ko:size-2.5 ko:rounded-pill", {
  variants: {
    tone: {
      agree: "ko:bg-agree",
      disagree: "ko:bg-disagree",
      neutral: "ko:bg-neutral-ink",
      none: "ko:bg-text-muted/55",
    },
  },
});

/*
 * The figure in the hole is off the type scale on purpose: it is sized to the
 * hole in the ring, not to the reading column, so it answers to the donut's
 * geometry rather than to the step above or below it. A scale step here would
 * be a coincidence.
 */
const valueClasses = "ko:font-display ko:text-[1.75rem] ko:font-semibold ko:leading-none ko:tracking-[-0.02em] ko:text-text-strong ko:tabular-nums";
const centerLabelClasses = "ko:font-sans ko:text-xs ko:text-text-muted";

const legendClasses = "ko:flex ko:flex-col ko:gap-2 ko:m-0 ko:p-0 ko:list-none ko:min-w-0";
const legendItemClasses = "ko:grid ko:grid-cols-[0.625rem_minmax(0,1fr)_auto] ko:items-center ko:gap-2";
const legendLabelClasses = "ko:font-sans ko:text-[0.8125rem] ko:text-text";
const legendValueClasses = "ko:font-sans ko:text-[0.8125rem] ko:font-semibold ko:text-text-strong ko:tabular-nums";

/**
 * How the answers split, as one ring, with a key beside it.
 *
 * The counterpart to the bars elsewhere on the dashboard: those compare parties
 * against each other, this one shows a single whole divided up, which is the
 * shape a proportion of a fixed 42 questions actually has. Segments carry the
 * same four tones as the answer marks, so the ring is readable against the recap
 * without a colour key — the legend beside it names the counts, not the colours.
 *
 * Segments worth nothing are dropped rather than drawn as zero-length arcs,
 * which would otherwise show up as stray dots where their gaps fall; the legend
 * drops them too, so it lists what the ring shows.
 *
 * The ring is decorative and the centre figure is plain text; the legend is a
 * real list, which is what a screen reader gets the split from.
 */
export function Donut({ segments, centerValue, centerLabel, size = 132, className }: Donut) {
  const visible = segments.filter((segment) => segment.value > 0);
  const total = visible.reduce((sum, segment) => sum + segment.value, 0);

  let cumulative = 0;

  return (
    <div className={twMerge("ko:flex ko:flex-wrap ko:items-center ko:gap-4", className)}>
      <div className="ko:relative ko:flex-none" style={{ width: size, height: size }}>
        {/* Rotated so the first segment starts at twelve o'clock rather than at three,
            which is where a stroke-dash ring would otherwise begin. */}
        <svg viewBox="0 0 100 100" className="ko:size-full ko:-rotate-90" aria-hidden="true">
          <circle className="ko:stroke-surface-sunken" cx="50" cy="50" r={RADIUS} fill="none" strokeWidth={13} />

          {total > 0
            ? visible.map((segment) => {
                const arc = (segment.value / total) * CIRCUMFERENCE;
                // A lone segment is a full ring; giving it a gap would cut a
                // notch in something that has no neighbour to be separated from.
                const drawn = visible.length > 1 ? Math.max(arc - GAP, 0.5) : arc;
                const offset = cumulative;
                cumulative += arc;

                return (
                  /* Butt caps, not round: rounded ends would eat into the gaps and make two
                     adjacent segments touch again at exactly the size the gap was added to fix. */
                  <circle
                    key={segment.tone}
                    className={twMerge(DonutSegmentVariants({ tone: segment.tone }))}
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    strokeWidth={13}
                    strokeLinecap="butt"
                    strokeDasharray={`${drawn} ${CIRCUMFERENCE - drawn}`}
                    strokeDashoffset={-offset}
                  />
                );
              })
            : null}
        </svg>

        <div className="ko:absolute ko:inset-0 ko:flex ko:flex-col ko:items-center ko:justify-center ko:gap-[0.0625rem]">
          <span className={valueClasses}>{centerValue}</span>
          <span className={centerLabelClasses}>{centerLabel}</span>
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className={legendClasses}>
          {visible.map((segment) => (
            <li key={segment.tone} className={legendItemClasses}>
              <span className={twMerge(DonutSwatchVariants({ tone: segment.tone }))} aria-hidden="true" />
              <span className={legendLabelClasses}>{segment.label}</span>
              <span className={legendValueClasses}>{segment.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
