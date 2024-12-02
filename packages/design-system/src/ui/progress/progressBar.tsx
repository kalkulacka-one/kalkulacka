import { cva, VariantProps } from "class-variance-authority";

type Props = {
  progress: number;
} & VariantProps<typeof progressBarVariants>;

const progressBarVariants = cva("k1-h-full k1-w-full", {
  variants: {
    color: {
      primary: "k1-bg-primary-strong",
      red: "k1-bg-red-500",
      orange: "k1-bg-orange-500",
      yellow: "k1-bg-yellow-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

const ProgressBar = ({ progress, color }: Props): JSX.Element => {
  const width = progress > 100 ? 100 : progress < 0 ? 0 : progress;

  return (
    <div
      className="k1-h-0.5 k1-w-full k1-overflow-hidden k1-rounded-full k1-bg-neutral lg:k1-h-1.5"
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${width}%`}
    >
      <div
        className={progressBarVariants({ color })}
        style={{ transform: `translateX(-${100 - (width || 0)}%)` }}
      />
    </div>
  );
};

export { ProgressBar, progressBarVariants };
