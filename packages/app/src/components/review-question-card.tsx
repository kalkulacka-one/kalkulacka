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
  const t = useTranslations("koa.components.reviewQuestionCard");
  const { title, detail, statement } = question;
  return (
    <Card shadow={false} className="koa:rounded-card! koa:border koa:border-border">
      <div className="koa:pt-fluid-card-pad-top koa:px-fluid-card-pad-side koa:pb-fluid-card-pad-bottom koa:flex koa:flex-col koa:gap-4">
        <div className="koa:flex koa:items-center koa:gap-2">
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{title}</span>
          <span className="koa:text-xs koa:text-text-subtle koa:tabular-nums">
            <span>{current}</span>/<span>{total}</span>
          </span>
        </div>
        <h3 className="koa:font-display koa:text-fluid-gist koa:font-bold koa:text-text-strong koa:leading-tight koa:tracking-tight koa:break-words">{statement}</h3>
        {detail && <p className="koa:hidden koa:sm:block koa:text-sm koa:text-text-muted koa:leading-relaxed koa:max-w-prose koa:break-words koa:tracking-wide">{detail}</p>}
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
