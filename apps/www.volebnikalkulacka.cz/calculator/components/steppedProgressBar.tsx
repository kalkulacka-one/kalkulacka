import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";

type StepStatus = boolean | null | undefined;

export type SteppedProgressBar<TItem extends Record<string, unknown>> = {
  stepItems: TItem[] | undefined;
  stepCurrent: number;
  stepTotal: number;
  idKey: keyof TItem;
  statusKey: keyof TItem;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("", {
  variants: {
    status: {
      inFavour: "bg-[var(--ko-color-primary)]",
      against: "bg-[var(--ko-color-secondary)]",
      isNull: "bg-[var(--ko-color-neutral-inactive)]",
    },
    height: {
      active: "h-2 bg-[var(--ko-color-neutral-active)]!",
      inactive: "h-1",
    },
  },
  defaultVariants: {
    status: "isNull",
    height: "inactive",
  },
});

function checkAnswer(status: StepStatus) {
  switch (status) {
    case true:
      return "inFavour";
    case false:
      return "against";
    case null:
    case undefined:
      return "isNull";
  }
}

export function SteppedProgressBar<TItem extends Record<string, unknown>>({ stepItems, stepCurrent, stepTotal, idKey, statusKey }: SteppedProgressBar<TItem>) {
  if (!stepItems || stepItems.length === 0) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/useFocusableInteractive: A non-interactive progressbar should not be focusable
    <div
      role="progressbar"
      aria-valuetext={`Question ${stepCurrent} of ${stepTotal}`}
      aria-valuenow={stepCurrent}
      aria-valuemin={1}
      aria-valuemax={stepTotal}
      className="flex items-center justify-start"
    >
      {stepItems.map((step, index) => {
        const id = step[idKey] as string;
        const status = step[statusKey] as StepStatus;

        return (
          <div
            key={`bar-${id}`}
            aria-hidden="true"
            style={{
              flex: `1 1 calc(100% / ${stepTotal})`,
              width: `calc(100% / ${stepTotal})`,
            }}
            className={twMerge(
              stepProgressVariants({
                status: checkAnswer(status),
                height: stepCurrent === index + 1 ? "active" : "inactive",
              }),
            )}
          />
        );
      })}
    </div>
  );
}
