import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

export type ProgressBar = {
  value: number;
  /**
   * A CSS colour (e.g. a per-item `light-dark()` accent) for the filled bar,
   * overriding `color`. For callers whose fill colour isn't one of the two
   * fixed variants below — a party's own accent, say — rather than adding a
   * variant per possible colour.
   */
  accentColor?: string;
} & VariantProps<typeof ProgressBarVariants>;

const ProgressBarVariants = cva("ko:h-full ko:w-full", {
  variants: {
    color: {
      primary: "ko:bg-primary",
      neutral: "ko:bg-neutral",
    },
    corner: {
      rounded: "",
      sharp: "",
    },
  },
  defaultVariants: {
    color: "primary",
    corner: "rounded",
  },
});

export function ProgressBar({ value, color, corner, accentColor }: ProgressBar) {
  const width = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    <div
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      className={twMerge(
        // 2026's row-top edge bar is a thin hairline (0.3125rem) against the
        // border colour, not the rounded free-standing bar's thicker surface-
        // sunken track — local to this corner variant, not a new token.
        corner === "sharp" ? "ko:h-[0.3125rem] ko:bg-border" : "ko:h-1.5 ko:bg-surface-sunken",
        "ko:w-full ko:overflow-hidden",
        corner === "rounded" ? "ko:rounded-full" : "",
      )}
    >
      <div
        className={accentColor ? "ko:h-full ko:w-full" : twMerge(ProgressBarVariants({ color, corner }))}
        style={accentColor ? { width: `${width}%`, backgroundColor: accentColor } : { width: `${width}%` }}
      />
    </div>
  );
}
