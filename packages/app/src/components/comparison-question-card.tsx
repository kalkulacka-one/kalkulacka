import { Card } from "@kalkulacka-one/design-system/server";

import type { QuestionViewModel } from "@/view-models/question";

export type ComparisonQuestionCard = {
  question: QuestionViewModel;
  current: number;
  total: number;
};

export function ComparisonQuestionCard({ question, current, total }: ComparisonQuestionCard) {
  const { title, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard" className="koa:border koa:border-slate-200 koa:w-fit">
      <div className="koa:p-3 koa:sm:p-6 koa:flex koa:flex-col koa:gap-4">
        <div className="koa:text-sm koa:text-slate-500">
          <span className="koa:font-bold koa:text-slate-600">{current}</span>/<span className="koa:mr-3">{total}</span>
          <span>{title}</span>
        </div>
        <h3 className="koa:font-display koa:text-lg koa:sm:text-xl koa:font-bold koa:text-slate-700 koa:leading-tight koa:tracking-tighter koa:break-words">{statement}</h3>
      </div>
    </Card>
  );
}
