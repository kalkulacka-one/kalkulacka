import { mdiStar, mdiStarOutline } from "@mdi/js";
import { Icon, ToggleButton } from "@repo/design-system/client";
import { logoCheck, logoCross } from "@repo/design-system/icons";
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
    <Card corner="topLeft" shadow="hard" className="border border-gray-200">
      <div className="p-3 sm:p-6 flex flex-col gap-4">
        <div className="text-sm text-gray-700">
          <span className="font-bold text-gray-700">{current}</span>/<span className="mr-3">{total}</span>
          <span>{title}</span>
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-gray-700 leading-tight tracking-tight break-words">{statement}</h3>
        {detail && <p className="hidden sm:block text-sm text-gray-700 leading-relaxed max-w-prose break-words tracking-wide">{detail}</p>}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-stretch">
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label="Számomra fontos">
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            <Icon icon={logoCheck} decorative={true} />
            Egyetértek
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            <Icon icon={logoCross} decorative={true} />
            Nem értek egyet
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
