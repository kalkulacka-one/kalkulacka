import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  currentStep: number;
  stepCount: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-w-9", {
  variants: {
    status: {
      active: "k1-bg-neutral-strong-active k1-h-2",
      inactive: "k1-bg-neutral-disaled k1-h-1",
    },
  },
});
const StepProgressFancy = ({ currentStep, stepCount }: Props): JSX.Element => {
  const getStepCount = (n: number) => {
    return Array.from({ length: n }, (_, i) => (i === n ? n - 1 : i));
  };

  const steps = getStepCount(stepCount);

  return (
    <>
      <div className="k1-flex k1-items-center">
        {steps.map((step, index) => {
          return (
            <div
              className={stepProgressVariants({
                status: index === currentStep - 1 ? "active" : "inactive",
              })}
              key={step}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export { StepProgressFancy, stepProgressVariants };
