import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { cva, type VariantProps } from "class-variance-authority";

type StepStatus = boolean | null | undefined;

export type SteppedProgressBar<TItem extends Record<string, unknown>> = {
  stepItems: TItem[];
  stepCurrent: number;
  stepTotal: number;
  idKey: keyof TItem;
  statusKey: keyof TItem;
  /** Hide from assistive technology when the same position is already announced elsewhere. */
  decorative?: boolean;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("ko:h-1.5 ko:rounded-pill", {
  variants: {
    status: {
      inFavour: "ko:bg-primary",
      against: "ko:bg-secondary",
      isNull: "ko:bg-border",
    },
    height: {
      active: "ko:min-w-3 ko:flex-[3_1_0] ko:bg-neutral!",
      inactive: "ko:min-w-0.5 ko:flex-1",
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

export function SteppedProgressBar<TItem extends Record<string, unknown>>({ stepItems, stepCurrent, stepTotal, idKey, statusKey, decorative = false }: SteppedProgressBar<TItem>) {
  if (!stepItems || stepItems.length === 0) {
    return null;
  }

  return (
    <div
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "progressbar", "aria-valuetext": `Question ${stepCurrent} of ${stepTotal}`, "aria-valuenow": stepCurrent, "aria-valuemin": 1, "aria-valuemax": stepTotal })}
      className="ko:flex ko:min-w-0 ko:items-center ko:gap-1"
    >
      {stepItems.map((step, index) => {
        const id = step[idKey] as string;
        const status = step[statusKey] as StepStatus;

        return (
          <div
            key={`bar-${id}`}
            aria-hidden="true"
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
