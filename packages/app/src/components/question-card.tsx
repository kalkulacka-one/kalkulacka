import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel } from "@/view-models/answer";
import type { QuestionViewModel } from "@/view-models/question";

import { answerCheckIcon, answerCrossIcon } from "./question-card-icons";

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
      <div className="koa:flex koa:flex-1 koa:flex-col koa:gap-4 koa:pt-[clamp(20px,14.4898px+1.4694vw,38px)] koa:px-[clamp(18px,12.4898px+1.4694vw,36px)] koa:pb-[clamp(18px,13.7143px+1.1429vw,32px)]">
        <div className="koa:flex koa:flex-wrap koa:gap-2">
          {category && (
            <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{category}</span>
          )}
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:border koa:border-border koa:px-2.5 koa:py-1 koa:text-xs koa:font-semibold koa:text-text-muted">{title}</span>
        </div>

        <div className="koa:flex koa:flex-1 koa:flex-col koa:justify-center koa:gap-3">
          <h3 className="koa:font-[family-name:var(--ko-typeface-question,var(--ko-typeface-sans)),ui-sans-serif,system-ui,sans-serif,Apple_Color_Emoji,Segoe_UI_Emoji,Segoe_UI_Symbol,Noto_Color_Emoji] koa:text-[clamp(27px,24.551px+0.6531vw,35px)] koa:font-bold koa:text-text-strong koa:leading-tight koa:tracking-tighter koa:break-words">
            {statement}
          </h3>
          {detail && <p className="koa:text-[clamp(15.5px,15.0408px+0.1224vw,17px)] koa:text-text-muted koa:leading-relaxed koa:break-words">{detail}</p>}
        </div>

        <div className="koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-3 koa:items-stretch">
          <span className="koa:inline-grid koa:h-[clamp(58px,51.8776px+1.6327vw,78px)] koa:aspect-square koa:place-items-center koa:rounded-full koa:border koa:border-border">
            <ToggleButton color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
              <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} className="koa:text-text-strong" />
            </ToggleButton>
          </span>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)} aria-label={t("yes")}>
            <Icon icon={answerCheckIcon} decorative={true} />
            <span className="koa:hidden koa:sm:inline">{t("yes")}</span>
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)} aria-label={t("no")}>
            <Icon icon={answerCrossIcon} decorative={true} />
            <span className="koa:hidden koa:sm:inline">{t("no")}</span>
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
