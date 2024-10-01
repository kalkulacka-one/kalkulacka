import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  currentStep: number;
  totalStep: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-rounded-full", {
  variants: {
    status: {
      active: "k1-bg-neutral-strong-active k1-w-5",
      inactive: "k1-bg-neutral-disaled k1-h-2 k1-w-2",
    },
  },
});
const StepProgress = ({ currentStep, totalStep }: Props): JSX.Element => {
  const getStepCount = (n: number) => {
    // or get the array length? depends on the data structure
    return Array.from({ length: n }, (_, i) => (i === n ? n - 1 : i));
  };

  const steps = getStepCount(totalStep);

  return (
    <>
      <div className="k1-flex k1-gap-1">
        {steps.map((step, index) => {
          return (
            // Make a step component
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

export { StepProgress, stepProgressVariants };
