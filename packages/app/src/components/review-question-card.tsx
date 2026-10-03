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

// Recap row: the whole question statement (there is no tap-to-open detail view yet, so this is the only place to
// read it while reviewing), the star and two small icon-only answer toggles. On phones the statement gets the full
// row width and the controls sit on a line below it; from `sm` up everything is on one line. The yes/no toggles drop their visible "Ano"/"Ne" label for an aria-label
// (Button renders icon-only children as a round button on its own); this list isn't the smoke test's target for
// that visible label — only the question screen's switch keeps the visible text.
export function ReviewQuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: ReviewQuestionCard) {
  const t = useTranslations("koa.components.reviewQuestionCard");
  const { statement } = question;
  return (
    <Card shadow={false} className="koa:rounded-card! koa:border koa:border-border koa:shadow-card">
      {/*
       * 2026's compact recap row runs 64-76px tall with its titles fitting in one or two lines — ours
       * forced 76px as a floor and spaced the two answer toggles wide enough that, together with the
       * star, they left too little width for the title and pushed it to wrap further than 2026. The
       * toggles below already pass size="small"; the design system's `answer` variant just ignored it
       * until it gained a matching 36px compound (button.tsx) — paired here with a shorter row floor
       * and tighter gaps so the title gets its width back too.
       */}
      <div className="koa:min-h-[64px] koa:py-3 koa:px-4 koa:sm:py-4 koa:sm:px-5 koa:grid koa:grid-cols-[auto_auto_1fr] koa:sm:grid-cols-[auto_1fr_auto] koa:items-center koa:gap-x-2.5 koa:gap-y-3">
        <div className="koa:col-start-1 koa:row-start-2 koa:sm:row-start-1">
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
        </div>
        <h3 className="koa:col-span-3 koa:row-start-1 koa:sm:col-span-1 koa:sm:col-start-2 koa:font-sans koa:text-[15px] koa:sm:text-[17px] koa:font-semibold koa:text-text koa:leading-snug koa:break-words">
          {statement}
        </h3>
        <div className="koa:col-start-2 koa:row-start-2 koa:sm:col-start-3 koa:sm:row-start-1 koa:flex koa:items-center koa:gap-1.5">
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
