import { Card, ProgressBar } from "@repo/design-system/server";
import { cva, type VariantProps } from "class-variance-authority";

type Result = {
  id: number;
  coalition_short: string;
  coalition_long: string;
  value: number;
};

export type ResultCard = {
  result: Result;
  order: number;
  strong?: boolean;
} & VariantProps<typeof ResultCardCircleVariants>;

const ResultCardCircleVariants = cva("ko:flex ko:items-center ko:justify-center ko:rounded-full", {
  variants: {
    strong: {
      true: "ko:bg-primary ko:size-18 ko:text-white ko:text-xl",
      false: "ko:bg-primary/20 ko:size-14 ko:text-sm",
    },
  },
});

export function ResultCard({ result, order, strong }: ResultCard) {
  const { id, coalition_long, coalition_short, value } = result;
  return (
    <Card corner="topLeft">
      <div className="ko:flex ko:gap-4 ko:items-center">
        <div>
          <div className={ResultCardCircleVariants({ strong })}>{order}.</div>
        </div>
        <div className="ko:flex ko:flex-col ko:flex-auto">
          <div className={`ko:font-bold ${strong ? "ko:text-2xl" : "ko:text-base"}`}>{coalition_short}</div>
          <ProgressBar value={value} />
          <div className="ko:text-base">{coalition_long}</div>
        </div>
        <span className={`ko:font-bold ${strong ? "ko:text-3xl" : "ko:text-2xl"}`}>{value} %</span>
      </div>
    </Card>
  );
}
