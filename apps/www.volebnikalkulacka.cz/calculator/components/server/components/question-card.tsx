import { Card } from "@repo/design-system/server";

import type { QuestionViewModel } from "../../../view-models";

export type QuestionCard = {
  question: QuestionViewModel;
  current: number;
  total: number;
};

export function QuestionCard({ question, current, total }: QuestionCard) {
  const { title, detail, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard">
      <div className="grid gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="grid grid-flow-col grid-cols-[auto_1fr] gap-2 text-sm">
          <span className="font-bold">
            {current}/{total}
          </span>
          <span className="font-light">{title}</span>
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight break-words">{statement}</h3>
        {detail && <p className="text-sm text-gray-900 leading-relaxed sm:text-base max-w-prose break-words">{detail}</p>}
      </div>
    </Card>
  );
}
