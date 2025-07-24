import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";

export type ProgressBar = {
  value: number;
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

export function ProgressBar({ value, color }: ProgressBar) {
  const width = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: A non-interactive progressbar should not be focusable
    <div role="progressbar" aria-valuenow={width} aria-valuemin={0} aria-valuemax={100} className={twMerge("ko:h-1.5 ko:w-full ko:overflow-hidden ko:rounded-full ko:bg-neutral-inactive")}>
      <div className={twMerge(ProgressBarVariants({ color }))} style={{ width: `${width}%` }} />
    </div>
  );
}
