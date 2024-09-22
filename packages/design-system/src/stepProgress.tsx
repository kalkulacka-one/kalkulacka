import React from "react";
import { cva, VariantProps } from "class-variance-authority";

type Props = {
  children: React.ReactNode;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("uppercase", {
  variants: {
    variant: {
      plain: "k1-bg-red-500 k1-w-auto",
      fancy: "k1-bg-blue-500 k1-w-full",
    },
  },
});
const StepProgress = ({ children, variant }: Props): JSX.Element => {
  const stepsCount = [1, 2, 3, 4, 5];
  const currentStep = 2;
  return (
    <>
      <div className="k1-flex k1-bg-slate-400 k1-gap-4">
        {stepsCount.map((step) => {
          return (
            <div className="k1-bg-red-400" key={step}>
              {children}
            </div>
          );
        })}
      </div>
    </>
  );
};

export { StepProgress, stepProgressVariants };

// TODO:

// 1. Current step should be highlighted, wrtie a logic and test
// 2. Style properly with cva after the logic is done
