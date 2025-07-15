import { type VariantProps, cva } from "class-variance-authority";

export type StepProgress = {
  stepCurrent: number;
  stepTotal: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("rounded-full border-1", {
  variants: {
    status: {
      active: "w-5 bg-black",
      inactive: "h-2 w-2 bg-transparent",
    },
  },
});

export function StepProgress({ stepTotal, stepCurrent }: StepProgress) {
  const stepArray = Array.from({ length: stepTotal }, (_, index) => index);
  return (
    <div className="flex gap-1">
      {stepArray.map((step, index) => {
        return (
          <div
            className={stepProgressVariants({
              status: stepCurrent === index + 1 ? "active" : "inactive",
            })}
            key={step}
          />
        );
      })}
    </div>
  );
}
