import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel, QuestionViewModel } from "@/view-models";

export type ReviewQuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

// Compact recap row (2026): a single line per question — star, title, two small icon-only answer toggles — instead
// of the old full statement/detail card. The yes/no toggles drop their visible "Ano"/"Ne" label for an aria-label
// (Button renders icon-only children as a round button on its own); this list isn't the smoke test's target for
// that visible label — only the question screen's switch keeps the visible text.
export function ReviewQuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: ReviewQuestionCard) {
  const t = useTranslations("koa.components.reviewQuestionCard");
  const { title } = question;
  return (
    <Card shadow={false} className="koa:rounded-card! koa:border koa:border-border koa:shadow-card">
      <div className="koa:min-h-[76px] koa:py-3 koa:px-4 koa:sm:px-5 koa:flex koa:items-center koa:gap-3">
        <ToggleButton size="small" color="neutral" variant="link" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
          <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
        </ToggleButton>
        <h3 className="koa:font-display koa:text-base koa:font-bold koa:text-text koa:leading-tight koa:tracking-tight koa:break-words koa:flex-1">{title}</h3>
        <div className="koa:flex koa:items-center koa:gap-2">
          <ToggleButton size="small" variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)} aria-label={t("yes")}>
            <Icon icon={logoCheck} decorative={true} />
          </ToggleButton>
          <ToggleButton size="small" variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)} aria-label={t("no")}>
            <Icon icon={logoCross} decorative={true} />
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
