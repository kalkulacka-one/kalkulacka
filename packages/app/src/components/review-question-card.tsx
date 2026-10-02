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
      {/*
       * 2026's compact recap row runs 64-76px tall with its titles fitting in one or two lines — ours
       * forced 76px as a floor and spaced the two answer toggles wide enough that, together with the
       * star, they left too little width for the title and pushed it to wrap further than 2026. Button
       * has no size smaller than "small" (40px, already at the top of the 36-40px target), so the fix
       * here is tightening what this row controls — a shorter floor and tighter gaps — not the toggles.
       */}
      <div className="koa:min-h-[64px] koa:py-2.5 koa:px-4 koa:sm:px-5 koa:flex koa:items-center koa:gap-2.5">
        <ToggleButton
          size="small"
          color="neutral"
          variant="round"
          checked={answer.answer?.isImportant || false}
          onChange={(checked: boolean) => onImportantChange(checked)}
          aria-label={t("important")}
        >
          <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
        </ToggleButton>
        <h3 className="koa:font-sans koa:text-[17px] koa:font-bold koa:text-text koa:leading-snug koa:break-words koa:flex-1">{title}</h3>
        <div className="koa:flex koa:items-center koa:gap-1.5">
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
