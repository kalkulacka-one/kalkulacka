import { Card } from "@repo/design-system/server";

import type { QuestionViewModel } from "../../../view-models";

export type QuestionCard = {
  question: QuestionViewModel;
  current: number;
  total: number;
};

export function QuestionCard({ question, current, total }: QuestionCard) {
  const { title, tags, detail, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard">
      <div className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="font-bold">
            {current}/{total}
          </span>
          <span className="font-light">{title}</span>
        </div>
        <h2 className="text-xl font-bold leading-tight text-black sm:text-2xl max-w-2xl">{statement}</h2>
        {detail && <p className="text-sm text-gray-900 leading-relaxed sm:text-base max-w-prose">{detail}</p>}
      </div>
    </Card>
  );
}
