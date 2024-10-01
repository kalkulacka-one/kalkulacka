import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  steps: {
    currentQuestion: number;
    totalQuestion: number;
    answers: { answerId: string; status: true | false | null | undefined }[];
  };
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-w-9", {
  variants: {
    status: {
      inFavour: "k1-bg-[#0070F4]",
      against: "k1-bg-[#D04646]",
      none: "k1-bg-[#1D1C1C]",
      isNull: "k1-bg-neutral-disaled",
    },
    height: {
      active: "k1-h-2",
      inactive: "k1-h-1",
    },
    defaultVariant: {
      status: "undefined",
      height: "inactive",
    },
  },
});

const StepProgressFancy = ({ steps }: Props): JSX.Element => {
  const answersData = steps.answers;
  const { currentQuestion } = steps;
  return (
    <div className="k1-flex k1-items-center">
      {answersData.map((answer, index) => {
        return (
          <div
            className={stepProgressVariants({
              status:
                answer.status === true
                  ? "inFavour"
                  : answer.status === false
                    ? "against"
                    : answer.status === null
                      ? "isNull"
                      : answer.status === undefined
                        ? "none"
                        : null,
              height: currentQuestion === index + 1 ? "active" : "inactive",
            })}
          ></div>
        );
      })}
    </div>
  );
};

export { StepProgressFancy, stepProgressVariants };
