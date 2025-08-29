import { Card } from "@repo/design-system/server";
import { ProgressBar } from "@repo/design-system/server";
import { type VariantProps, cva } from "class-variance-authority";

type Result = {
  id: number;
  name: string;
  percentage: number;
};

export type ResultCandidateCard = {
  result: Result;
  order: number;
  strong?: boolean;
} & VariantProps<typeof ResultCandidateCardCircleVariants>;

const ResultCandidateCardCircleVariants = cva("flex items-center justify-center rounded-full", {
  variants: {
    strong: {
      true: "bg-[var(--ko-color-primary)] size-18 text-white text-xl",
      false: "bg-[var(--ko-color-primary)]/20 size-14 text-sm",
    },
  },
});

export function ResultCandidateCard({ result, order, strong }: ResultCandidateCard) {
  const { id, name, percentage } = result;
  const roundPercentage = Math.round(percentage);
  return (
    <Card corner="topLeft">
      <div className="flex gap-4 items-center">
        <div>
          <div className={ResultCandidateCardCircleVariants({ strong })}>{order}.</div>
        </div>
        <div className="flex flex-col flex-auto">
          <div className={`font-bold ${strong ? "text-2xl" : "text-base"}`}>{name}</div>
          <ProgressBar value={roundPercentage} />
          <div className="text-base">{name}</div>
        </div>
        <span className={`font-bold ${strong ? "text-3xl" : "text-2xl"}`}>{roundPercentage} %</span>
      </div>
    </Card>
  );
}
