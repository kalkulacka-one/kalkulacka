import { twMerge } from "@kalkulacka-one/design-system/utils";
import { cva, type VariantProps } from "class-variance-authority";

type StepStatus = boolean | null | undefined;

export type SteppedProgressBar<TItem extends Record<string, unknown>> = {
  stepItems: TItem[];
  stepCurrent: number;
  stepTotal: number;
  idKey: keyof TItem;
  statusKey: keyof TItem;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("", {
  variants: {
    status: {
      inFavour: "ko:bg-primary",
      against: "ko:bg-secondary",
      isNull: "ko:bg-neutral-inactive",
    },
    height: {
      active: "ko:h-2 ko:bg-neutral-active!",
      inactive: "ko:h-1",
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
      className="ko:flex ko:items-center ko:justify-start"
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
