import { Card } from "@repo/design-system/server";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import type { Tag } from "../../../../packages/schema/schemas/tags.schema";

export type QuestionCard = {
  question: Question;
  questionCurrent: number;
  questionTotal: number;
};

export function QuestionCard({ question, questionCurrent, questionTotal }: QuestionCard) {
  const { title, tags, detail, statement } = question;
  return (
    <Card corner="topLeft">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <span>
            {questionCurrent}/{questionTotal}
          </span>
          <span>{title}</span>
          {tags?.map((tag: Tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <h2>{statement}</h2>
        {detail && <span>{detail}</span>}
      </div>
    </Card>
  );
}
