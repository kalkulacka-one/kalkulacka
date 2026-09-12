// Ported from kalkulacka-2026/packages/ui/src/meter/meter.tsx and meter.module.css
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type MeterTone = NonNullable<VariantProps<typeof MeterFillVariants>["tone"]>;
export type MeterSize = NonNullable<VariantProps<typeof MeterTrackVariants>["size"]>;

export type Meter = {
  /** 0–100. Values outside the range are clamped rather than overflowing the track. */
  value: number;
  /**
   * Which ink the fill uses. `agree` is the match colour; `neutral` is for bars
   * that rank something without taking a side.
   */
  tone?: MeterTone | null;
  size?: MeterSize | null;
  /**
   * Seconds to wait before growing from zero. The results list staggers these so
   * the bars arrive with their rows. Ignored under `prefers-reduced-motion`. A
   * negative delay (the ranking passes `-1` for a result already shown once)
   * is an animation that has already finished: the bar is simply full.
   */
  delay?: number;
  /**
   * Decorative by default: the percentage is almost always text within a few
   * pixels of the bar, and announcing both reads the same number twice. Pass a
   * label only where the bar is genuinely the sole statement of the value.
   */
  label?: string;
  /**
   * A colour for the fill instead of the tone's ink — the ranking paints each
   * candidate's own (see `MatchRow` and `partyColor`). Any CSS colour,
   * `light-dark()` included.
   */
  accent?: string;
  /** For the track — the match row squares it off and pins it to the card's top edge. */
  className?: string;
};

export const MeterTrackVariants = cva("ko:w-full ko:rounded-pill ko:bg-surface-sunken ko:overflow-hidden", {
  variants: {
    size: {
      medium: "ko:h-2",
      small: "ko:h-[0.3125rem]",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

/*
 * The growth is a theme animation (`--ko-animate-meter-grow` in `styles.css`)
 * grown from the left edge with `transform`, so the width is right on the
 * first frame. Switched off outright under reduced motion — the collapsed
 * duration alone would still honour a stagger delay and leave the bar
 * invisible for that long — and anyone who has asked for less motion gets
 * the final state on frame one.
 */
export const MeterFillVariants = cva("ko:h-full ko:rounded-pill ko:origin-left ko:animate-meter-grow ko:motion-reduce:animate-none", {
  variants: {
    tone: {
      agree: "ko:bg-agree",
      neutral: "ko:bg-neutral-ink",
    },
  },
  defaultVariants: {
    tone: "agree",
  },
});

/**
 * A horizontal proportion — the match percentage, and the dashboard's topic
 * rows. This is the retired `ProgressBar` restyled to the 2026 Meter; the old
 * name survives as an alias.
 */
export function Meter({ value, tone, size, delay = 0, label, accent, className }: Meter) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={twMerge(MeterTrackVariants({ size }), className)}
      {...(label
        ? {
            role: "meter",
            "aria-valuenow": Math.round(clamped),
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": label,
          }
        : { "aria-hidden": "true" })}
    >
      <div className={twMerge(MeterFillVariants({ tone }))} style={{ width: `${clamped}%`, animationDelay: delay ? `${delay}s` : undefined, backgroundColor: accent }} />
    </div>
  );
}

/** @deprecated The retired name of `Meter`. */
export const ProgressBar = Meter;
/** @deprecated The retired name of `Meter`'s props. */
export type ProgressBar = Meter;
