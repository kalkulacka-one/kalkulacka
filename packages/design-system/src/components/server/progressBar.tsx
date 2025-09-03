import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type ProgressBar = {
  value: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
} & VariantProps<typeof ProgressBarVariants>;

const ProgressBarVariants = cva("ko:h-full ko:w-full", {
  variants: {
    color: {
      primary: "ko:bg-primary",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export function ProgressBar({ value, color, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy }: ProgressBar) {
  const width = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    <div
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={twMerge("ko:h-1.5 ko:w-full ko:overflow-hidden ko:rounded-full ko:bg-neutral-inactive")}
    >
      <div className={twMerge(ProgressBarVariants({ color }))} style={{ width: `${width}%` }} />
    </div>
  );
}
