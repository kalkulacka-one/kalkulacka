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
        <h3 className="font-display text-lg font-bold leading-tight break-words">{statement}</h3>
        {detail && <p className="text-sm text-gray-900 leading-relaxed sm:text-base max-w-prose break-words">{detail}</p>}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-stretch">
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
