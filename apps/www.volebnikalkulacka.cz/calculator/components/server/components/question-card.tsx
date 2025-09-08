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
    <Card corner="topLeft" padding={"lg"}>
      <div>
        <div className="mb-3">
          <span className="pr-2">
            {current}/{total}
          </span>
          <span className="font-semibold pr-2">{title}</span>
          {tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h2 className="ko:font-display font-semibold tracking-[-0.03em] text-2xl mb-3">{statement}</h2>
        {detail && <span>{detail}</span>}
      </div>
    </Card>
  );
}
