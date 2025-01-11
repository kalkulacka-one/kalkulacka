import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  answers?: { message: string }[];
  currentQuestion?: number;
  totalQuestion?: number;
  steps: {
    currentQuestion: number;
    totalQuestion: number;
    answers: [];
  };
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-rounded-full", {
  variants: {
    status: {
      active: "k1-w-5 k1-bg-neutral-strong-active",
      inactive: "k1-h-2 k1-w-2 k1-bg-neutral-disabled",
    },
  },
});
const StepProgress = ({ answers, currentQuestion }: Props): JSX.Element => {
  return (
    <>
      <div className="k1-flex k1-gap-1">
        {answers?.map((answer, index) => {
          return (
            <div
              className={stepProgressVariants({
                status: currentQuestion === index + 1 ? "active" : "inactive",
              })}
              key={`Bar number: ${index}`}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export { StepProgress, stepProgressVariants };
