"use client";

import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("calculator.question");
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
        <div className="flex sm:flex-wrap gap-4 items-stretch sm:flex-row flex-col">
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important-aria-label")}>
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            <Icon icon={logoCheck} decorative={true} />
            {t("agree-button")}
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            <Icon icon={logoCross} decorative={true} />
            {t("disagree-button")}
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
