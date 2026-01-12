import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel, QuestionViewModel } from "@/view-models";

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
  const t = useTranslations("koa.components.questionNavigationCard");
  const { title, detail, statement } = question;
  return (
    <Card corner="topLeft" shadow="hard" className="koa:border koa:border-slate-200">
      <div className="koa:p-3 koa:sm:p-6 koa:flex koa:flex-col koa:gap-4">
        <div className="koa:text-sm koa:text-slate-500">
          <span className="koa:font-bold koa:text-slate-600">{current}</span>/<span className="koa:mr-3">{total}</span>
          <span>{title}</span>
        </div>
        <h3 className="koa:font-display koa:text-lg koa:sm:text-xl koa:font-bold koa:text-slate-700 koa:leading-tight koa:tracking-tight koa:break-words">{statement}</h3>
        {detail && <p className="koa:hidden koa:sm:block koa:text-sm koa:text-slate-600 koa:leading-relaxed koa:max-w-prose koa:break-words koa:tracking-wide">{detail}</p>}
        <div className="koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-4 koa:items-stretch">
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            <Icon icon={logoCheck} decorative={true} />
            {t("yes")}
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            <Icon icon={logoCross} decorative={true} />
            {t("no")}
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
