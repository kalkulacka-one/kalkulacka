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
    <Card shadow={false} className="koa:rounded-card! koa:border koa:border-border">
      <div className="koa:pt-fluid-card-pad-top koa:px-fluid-card-pad-side koa:pb-fluid-card-pad-bottom koa:flex koa:flex-col koa:gap-4">
        <div className="koa:flex koa:items-center koa:gap-2">
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{title}</span>
          <span className="koa:text-xs koa:text-text-subtle koa:tabular-nums">
            <span>{current}</span>/<span>{total}</span>
          </span>
        </div>
        <h3 className="koa:font-display koa:text-fluid-question koa:font-bold koa:text-slate-700 koa:leading-tight koa:tracking-tighter koa:break-words">{statement}</h3>
        {detail && <p className="koa:text-sm koa:sm:text-base koa:text-text-muted koa:leading-relaxed koa:max-w-prose koa:break-words koa:tracking-wide">{detail}</p>}
      </div>
    </Card>
  );
}
