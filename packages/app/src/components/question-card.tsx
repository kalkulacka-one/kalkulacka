import { Card } from "@kalkulacka-one/design-system/server";

import type { QuestionViewModel } from "@/view-models/question";

export type QuestionCard = {
  question: QuestionViewModel;
  current: number;
  total: number;
};

export function QuestionCard({ question, current, total }: QuestionCard) {
  const { title, detail, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard" className="koa:border koa:border-slate-200">
      <div className="koa:p-3 koa:sm:p-6 koa:flex koa:flex-col koa:gap-4">
        <div className="koa:text-sm koa:text-slate-500">
          <span className="koa:font-bold koa:text-slate-600">{current}</span>/<span className="koa:mr-3">{total}</span>
          <span>{title}</span>
        </div>
        <h3 className="koa:font-display koa:text-2xl koa:sm:text-3xl koa:font-bold koa:text-slate-700 koa:leading-tight koa:tracking-tighter koa:break-words">{statement}</h3>
        {detail && <p className="koa:text-sm koa:sm:text-base koa:text-slate-600 koa:leading-relaxed koa:max-w-prose koa:break-words koa:tracking-wide">{detail}</p>}
      </div>
    </Card>
  );
}
