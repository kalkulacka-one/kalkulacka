import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel } from "@/view-models/answer";
import type { QuestionViewModel } from "@/view-models/question";

export type QuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

/**
 * The one card in the answering flow: chips, statement, detail, and — always
 * pinned to the card's own bottom, in thumb reach on a phone — the answer row.
 *
 * Height is reserved (`sm` and up) so the card doesn't resize from question to
 * question; short statements just leave the answer row where it is, with
 * spare room above it instead of the card shrinking to fit.
 */
export function QuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: QuestionCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const { title, detail, statement, tags } = question;
  const category = tags?.[0];

  return (
    <Card shadow={false} className="koa:flex koa:flex-1 koa:flex-col koa:rounded-card! koa:border koa:border-border koa:shadow-card koa:sm:flex-none koa:sm:min-h-[min(28rem,calc(100dvh-16rem))]">
      <div className="koa:flex koa:h-full koa:flex-col koa:gap-4 koa:pt-fluid-card-pad-top koa:px-fluid-card-pad-side koa:pb-fluid-card-pad-bottom">
        <div className="koa:flex koa:flex-wrap koa:gap-2">
          {category && (
            <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{category}</span>
          )}
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:border koa:border-border koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{title}</span>
        </div>

        <div className="koa:flex koa:flex-1 koa:flex-col koa:justify-center koa:gap-3">
          <h3 className="koa:font-question koa:text-fluid-question koa:font-bold koa:text-text-strong koa:leading-tight koa:tracking-tighter koa:break-words">{statement}</h3>
          {detail && <p className="koa:text-fluid-gist koa:text-text-muted koa:leading-relaxed koa:break-words">{detail}</p>}
        </div>

        <div className="koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-3 koa:items-stretch">
          <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)} aria-label={t("yes")}>
            <Icon icon={logoCheck} decorative={true} />
            <span className="koa:hidden koa:sm:inline">{t("yes")}</span>
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)} aria-label={t("no")}>
            <Icon icon={logoCross} decorative={true} />
            <span className="koa:hidden koa:sm:inline">{t("no")}</span>
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
