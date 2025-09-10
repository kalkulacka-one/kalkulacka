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
      <div className="grid gap-4 p-8">
        <div className="grid grid-flow-col auto-cols-max gap-2 items-center text-sm">
          <span className="font-bold">
            {current}/{total}
          </span>
          <span className="font-light">{title}</span>
        </div>
        <h3 className="font-display text-2xl font-bold leading-tight max-w-2xl break-words">{statement}</h3>
        {detail && <p className="text-sm text-gray-900 leading-relaxed sm:text-base max-w-prose break-words">{detail}</p>}
      </div>
    </Card>
  );
}
