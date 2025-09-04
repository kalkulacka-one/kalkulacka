import { ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../../../packages/schema/schemas/question.schema";

export type RecapQuestionCard = {
  question: Question;
  answer: Answer;
  current: number;
  total: number;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

export function RecapQuestionCard({ question, answer, current, total, onAgreeChange, onDisagreeChange, onImportantChange }: RecapQuestionCard) {
  const { title, statement, detail, tags } = question;
  return (
    <Card corner="topLeft">
      <div>
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
        </div>
        {detail && <div>{detail}</div>}
        <div>
          <div>
            <ToggleButton variant="answer" color="primary" checked={answer.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
              Jsem pro
            </ToggleButton>
            <ToggleButton variant="answer" color="secondary" checked={answer.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
              Jsem proti
            </ToggleButton>
          </div>
          <div>
            <ToggleButton variant="link" checked={answer.isImportant} onChange={(checked: boolean) => onImportantChange(checked)}>
              Pro mě důležité
            </ToggleButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
