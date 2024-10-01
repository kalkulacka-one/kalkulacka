import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  steps: {
    currentQuestion: number;
    totalQuestion: number;
    answers: { answerId: string; status: boolean | null | undefined }[];
  };
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-rounded-full", {
  variants: {
    status: {
      active: "k1-bg-neutral-strong-active k1-w-5",
      inactive: "k1-bg-neutral-disaled k1-h-2 k1-w-2",
    },
  },
});
const StepProgress = ({ steps }: Props): JSX.Element => {
  const { currentQuestion } = steps;
  const answersData = steps.answers;
  return (
    <>
      <div className="k1-flex k1-gap-1">
        {answersData.map((answer, index) => {
          return (
            <div
              className={stepProgressVariants({
                status: currentQuestion === index + 1 ? "active" : "inactive",
              })}
              key={answer.answerId}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export { StepProgress, stepProgressVariants };
