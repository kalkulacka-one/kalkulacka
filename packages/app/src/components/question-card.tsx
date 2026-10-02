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
 *
 * `mb-2` below is deliberate, not decorative: the step row sits in the same
 * flex column right after this card (see pages/question.tsx), and without it
 * the two touch — this is the only thing giving the row its own breathing
 * room above it rather than reading as glued to the card's bottom edge.
 */
export function QuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: QuestionCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const { title, detail, statement, tags } = question;
  const category = tags?.[0];

  return (
    <Card
      shadow={false}
      className="koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:rounded-card! koa:border koa:border-border koa:shadow-card koa:mb-2 koa:sm:mb-0 koa:sm:flex-none koa:sm:min-h-[min(28rem,calc(100dvh-16rem))]"
    >
      <div className="koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:gap-4 koa:pt-[clamp(20px,14.4898px+1.4694vw,38px)] koa:px-[clamp(18px,12.4898px+1.4694vw,36px)] koa:pb-[clamp(18px,13.7143px+1.1429vw,32px)]">
        <div className="koa:flex koa:flex-wrap koa:gap-2">
          {category && (
            <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-[clamp(13.5px,13.1939px+0.0816vw,14.5px)] koa:leading-[1.2] koa:font-medium koa:text-text">
              {category}
            </span>
          )}
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:border koa:border-border koa:px-2.5 koa:py-1 koa:text-[clamp(13.5px,13.1939px+0.0816vw,14.5px)] koa:leading-[1.2] koa:font-medium koa:text-text">
            {title}
          </span>
        </div>

        {/*
          The one part of the card allowed to scroll: on a short viewport (390×664
          measured), a long statement+detail can outgrow the card's reserved height.
          `min-h-0` lets this flex item actually shrink to the space left by the
          chips and answer row above/below it, instead of forcing the card — and
          with it the page and the step row beneath — to grow past the viewport.
        */}
        <div className="koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:justify-center koa:gap-3 koa:overflow-y-auto">
          <h3 className="koa:font-[family-name:var(--ko-typeface-question,var(--ko-typeface-sans)),ui-sans-serif,system-ui,sans-serif,Apple_Color_Emoji,Segoe_UI_Emoji,Segoe_UI_Symbol,Noto_Color_Emoji] koa:text-[clamp(27px,24.551px+0.6531vw,35px)] koa:font-bold koa:text-text koa:leading-[1.22] koa:tracking-[-0.03em] koa:break-words">
            {statement}
          </h3>
          {detail && <p className="koa:text-[clamp(15.5px,15.0408px+0.1224vw,17px)] koa:text-text-muted koa:leading-[1.62] koa:break-words">{detail}</p>}
        </div>

        <div className="koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-3 koa:items-stretch">
          <ToggleButton variant="round" color="neutral" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
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
