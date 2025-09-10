import { ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";

import type { AnswerViewModel, QuestionViewModel } from "../../../view-models";

export type ReviewQuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  current: number;
  total: number;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

export function ReviewQuestionCard({ question, answer, current, total, onAgreeChange, onDisagreeChange, onImportantChange }: ReviewQuestionCard) {
  const { title, statement } = question;
  return (
    <Card corner="topLeft">
      <div>
        <div>
          <div>
            <span>
              {current}/{total}
            </span>
            <span>{title}</span>
          </div>
          <h2>{statement}</h2>
        </div>
        <div>
          <div>
            <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
              Jsem pro
            </ToggleButton>
            <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
              Jsem proti
            </ToggleButton>
          </div>
          <div>
            <ToggleButton variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)}>
              Pro mě důležité
            </ToggleButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
