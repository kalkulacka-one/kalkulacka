import { type VariantProps, cva } from "class-variance-authority";

export type PercentageBar = {
  value: number;
} & VariantProps<typeof percentageBarVariants>;

const percentageBarVariants = cva("h-full w-full", {
  variants: {
    color: {
      primary: "bg-blue-500",
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export function PercentageBar({ value, color }: PercentageBar) {
  const width = value > 100 ? 100 : value < 0 ? 0 : value;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100" role="range" aria-valuenow="23" aria-valuemin="0" aria-valuemax="100" aria-label="ss">
      <div className={percentageBarVariants({ color })} style={{ transform: `translateX(-${100 - (width || 0)}%)` }} />
    </div>
  );
}
