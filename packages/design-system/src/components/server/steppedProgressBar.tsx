import { twMerge } from "@repo/design-system/utils";
import { type VariantProps, cva } from "class-variance-authority";

export type SteppedProgressBar = {
  questions: any[];
  stepCurrent: number;
  stepTotal: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("", {
  variants: {
    status: {
      inFavour: "ko:bg-primary",
      against: "ko:bg-secondary",
      // none: "bg-neutral-strong-active",
      isNull: "ko:bg-neutral-inactive",
    },
    height: {
      active: "ko:h-2 ko:bg-neutral-active!",
      inactive: "ko:h-1",
    },
    defaultVariant: {
      status: "isNull",
      height: "inactive",
    },
  },
});

function checkAnswer(status: number) {
  switch (status) {
    case 1:
      return "inFavour";
    case 2:
      return "against";
    case 3:
      return "isNull";
    case 0:
      return "isNull";
  }
}

export function SteppedProgressBar({ questions, stepCurrent, stepTotal }: SteppedProgressBar) {
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
      {questions.map((question: any[], index) => {
        return (
          <div
            key={`bar-${question.id}`}
            aria-hidden="true"
            style={{
              flex: `1 1 calc(100% / ${stepTotal})`,
              width: `calc(100% / ${stepTotal})`,
            }}
            className={twMerge(
              stepProgressVariants({
                status: checkAnswer(question.answer),
                height: stepCurrent === index + 1 ? "active" : "inactive",
              }),
            )}
          />
        );
      })}
    </div>
  );
}
