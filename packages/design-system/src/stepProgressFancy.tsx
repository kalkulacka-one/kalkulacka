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
      true: "k1-bg-green-400",
      false: "k1-bg-red-400",
      null: "k1-bg-yellow-400",
      undefined: "k1-bg-blue-400",
    },
  },
});

const StepProgressFancy = ({ currentStep, stepCount }: Props): JSX.Element => {
  const getStepCount = (n: number) => {
    return Array.from({ length: n }, (_, i) => (i === n ? n - 1 : i));
  };

  const steps = getStepCount(stepCount);

  const mockupData = [
    {
      currentStep: 3,
      stepCount: 4,
      stepStatus: [
        { step: 1, status: true },
        { step: 2, status: false },
        { step: 3, status: null },
        { step: 4, status: undefined },
      ],
    },
  ];

  return (
    <>
      {/* Mockup data */}
      <div className="k1-flex k1-items-center">
        {mockupData.map((data) => {
          const status = data.stepStatus;
          return status.map((step, index) => (
            // Make a step component
            <div
              className={`k1-w-9 ${
                step.status === true
                  ? "k1-bg-[#0070F4]"
                  : step.status === false
                    ? "k1-bg-[#D04646]"
                    : step.status === null
                      ? "k1-bg-yellow-400"
                      : step.status === undefined
                        ? "k1-bg-neutral-disaled"
                        : null
              } ${index === data.currentStep - 1 ? "k1-h-2" : "k1-h-1"}`}
            ></div>
          ));
        })}
      </div>
    </>
  );
};

export { StepProgressFancy, stepProgressVariants };
