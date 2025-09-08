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
    <Card corner="topLeft">
      <div>
        <div>
          <span>
            {current}/{total}
          </span>
          <span>{title}</span>
          {tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h2>{statement}</h2>
        {detail && <span>{detail}</span>}
      </div>
    </Card>
  );
}
