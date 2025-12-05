import { Card } from "@kalkulacka-one/design-system/server";

import type { QuestionViewModel } from "../../../view-models/server";

export type ComparisonQuestionCard = {
  question: QuestionViewModel;
  current: number;
  total: number;
};

export function ComparisonQuestionCard({ question, current, total }: ComparisonQuestionCard) {
  const { title, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard" className="border border-slate-200 w-fit">
      <div className="p-3 sm:p-6 flex flex-col gap-4">
        <div className="text-sm text-slate-500">
          <span className="font-bold text-slate-600">{current}</span>/<span className="mr-3">{total}</span>
          <span>{title}</span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-700 leading-tight tracking-tighter break-words">{statement}</h3>
      </div>
    </Card>
  );
}
