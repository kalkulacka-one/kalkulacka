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

// mockup data
const mockupData = [
  {
    answers: [
      { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
      { answerId: "2", status: null },
      { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
      { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
      { answerId: "5", status: true },
      { answerId: "6", status: true }, //
      { answerId: "7", status: false },
      { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
    ],
    totalQuestion: 4,
    currentQuestion: 8,
  },
];

const StepProgressFancy = ({ currentStep, stepCount }: Props): JSX.Element => {
  const getStepCount = (n: number) => {
    return Array.from({ length: n }, (_, i) => (i === n ? n - 1 : i));
  };

  return (
    <>
      {/* Mockup data */}
      <div className="k1-flex k1-items-center">
        {mockupData.map((data) => {
          const status = data.answers;
          return status.map((step, index) => (
            // Make a step component ?
            <div
              className={`k1-w-9 ${
                step.status === true
                  ? "k1-bg-[#0070F4]"
                  : step.status === false
                    ? "k1-bg-[#D04646]"
                    : step.status === null
                      ? "k1-bg-[#1D1C1C]"
                      : step.status === undefined
                        ? "k1-bg-neutral-disaled"
                        : null
              } ${data.currentQuestion === index + 1 ? "k1-h-2 k1-bg-[#1D1C1C]" : "k1-h-1"}`}
            ></div>
          ));
        })}
      </div>
    </>
  );
};

export { StepProgressFancy, stepProgressVariants };
