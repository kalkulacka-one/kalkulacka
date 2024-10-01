import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  stepsData: {
    currentQuestion: number;
    totalQuestion: number;
    answers: { answerId: string; status: boolean | null | undefined }[];
  };
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-w-9", {
  variants: {
    status: {
      active: "k1-bg-neutral-strong-active k1-h-2",
      inactive: "k1-bg-neutral-disaled k1-h-1",
      true: "k1-bg-[#0070F4]",
      false: "k1-bg-[#D04646]",
      null: "k1-bg-[#1D1C1C]",
      undefined: "k1-bg-neutral-disaled",
    },
  },
});

const StepProgressFancy = ({ stepsData }: Props): JSX.Element => {
  const answersData = stepsData.answers;
  const { currentQuestion } = stepsData;
  return (
    <div className="k1-flex k1-items-center">
      {answersData.map((answer, index) => {
        return (
          <div
            className={`k1-w-9 ${
              answer.status === true
                ? "k1-bg-[#0070F4]"
                : answer.status === false
                  ? "k1-bg-[#D04646]"
                  : answer.status === null
                    ? "k1-bg-[#1D1C1C]"
                    : answer.status === undefined
                      ? "k1-bg-neutral-disaled"
                      : null
            } ${currentQuestion === index + 1 ? "k1-h-2 k1-bg-[#1D1C1C]" : "k1-h-1"}`}
          ></div>
        );
      })}
    </div>
  );
};

export { StepProgressFancy, stepProgressVariants };
