import { cva, VariantProps } from "class-variance-authority";

type Props<Steps = any[]> = {
  steps?: Steps;
  currentStep?: number | null;
  stepTotal?: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("k1-rounded-full", {
  variants: {
    status: {
      active: "k1-w-5 k1-bg-neutral-strong-active",
      inactive: "k1-h-2 k1-w-2 k1-bg-neutral-disabled",
    },
  },
});
const StepProgress = ({ steps, currentStep }: Props): JSX.Element => {
  return (
    <>
      <div className="k1-flex k1-gap-1">
        {steps?.map((_, index) => {
          return (
            <div
              className={stepProgressVariants({
                status: currentStep === index + 1 ? "active" : "inactive",
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
