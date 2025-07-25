import { twMerge } from "@repo/design-system/utils";
import { cva } from "class-variance-authority";

export type DotIndicator = {
  stepCurrent: number;
  stepTotal: number;
};

const DotIndicatorVariants = cva("ko:rounded-full ko:h-2", {
  variants: {
    status: {
      active: "ko:w-5 ko:bg-neutral-active",
      inactive: "ko:w-2 ko:bg-neutral-inactive",
    },
  },
});

export function DotIndicator({ stepTotal, stepCurrent }: DotIndicator) {
  if (stepCurrent <= 0 || stepTotal <= 0 || stepCurrent > stepTotal) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("DotIndicator: Invalid props - stepCurrent and stepTotal must be positive numbers, and stepCurrent must not exceed stepTotal");
    }
  }
  const stepArray = Array.from({ length: stepTotal }, (_, index) => index);
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: A non-interactive progressbar should not be focusable
    <div className={twMerge("ko:flex ko:gap-1")} role="progressbar" aria-valuenow={stepCurrent} aria-valuemin={1} aria-valuemax={stepTotal} aria-label={`Step ${stepCurrent} of ${stepTotal}`}>
      {stepArray.map((step, index) => {
        return (
          <div
            className={twMerge(
              DotIndicatorVariants({
                status: stepCurrent === index + 1 ? "active" : "inactive",
              }),
            )}
            key={step}
          />
        );
      })}
    </div>
  );
}
