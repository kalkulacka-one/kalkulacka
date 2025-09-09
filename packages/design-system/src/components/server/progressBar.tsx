import { twMerge } from "@repo/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

export type ProgressBar = {
  value: number;
} & VariantProps<typeof ProgressBarVariants>;

const ProgressBarVariants = cva("ko:h-full ko:w-full", {
  variants: {
    color: {
      primary: "ko:bg-primary",
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

export function ProgressBar({ value, color, corner }: ProgressBar) {
  const width = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: A non-interactive progressbar should not be focusable
    <div
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      className={twMerge("ko:h-1.5 ko:w-full ko:overflow-hidden ko:bg-neutral-inactive", corner === "rounded" ? "ko:rounded-full" : "")}
    >
      <div className={twMerge(ProgressBarVariants({ color, corner }))} style={{ width: `${width}%` }} />
    </div>
  );
}
