import { mdiStar, mdiStarOutline } from "@mdi/js";
import { Icon, ToggleButton } from "@repo/design-system/client";
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
    <Card corner="topLeft" shadow="hard">
      <div className="grid gap-4 p-8">
        <div className="grid grid-flow-col auto-cols-max gap-2 items-center text-sm">
          <span className="font-bold">
            {current}/{total}
          </span>
          <span className="font-light">{title}</span>
        </div>
        <h3 className="ko:font-display text-lg font-bold leading-tight max-w-2xl break-words">{statement}</h3>
        <div className="grid gap-3 items-center" style={{ gridTemplateColumns: "max-content 1fr 1fr" }}>
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label="Pro mě důležité">
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            Ano
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            Ne
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
