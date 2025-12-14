import { Button, Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";

import { mdiArrowLeft, mdiArrowRight, mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel } from "@/view-models/answer";

import { NavigationCard } from "./navigation-card";

const HEIGHT = "h-[138px]";

export type QuestionNavigationCard = {
  current: number;
  total: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

export function QuestionNavigationCard({ current, total, onPreviousClick, onNextClick, answer, onAgreeChange, onDisagreeChange, onImportantChange }: QuestionNavigationCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const previousButtonLabel = current === 1 ? t("guide") : t("previous");
  const nextButtonLabel = answer.answer?.answer !== undefined ? t("next") : t("skip");

  return (
    <NavigationCard>
      <div className="koa:grid koa:grid-flow-row koa:gap-2 koa:sm:gap-3">
        <div className="koa:grid koa:grid-cols-[1fr_1fr] koa:@[350px]:grid-cols-[minmax(8rem,1fr)_auto_minmax(8rem,1fr)] koa:gap-1 koa:@sm:gap-2 koa:items-center">
          <div className="koa:justify-self-start">
            <Button size="small" variant="link" color="neutral" onClick={onPreviousClick}>
              <Icon icon={mdiArrowLeft} decorative={true} />
              {previousButtonLabel}
            </Button>
          </div>
          <div className="koa:justify-self-center koa:hidden koa:@[350px]:block">
            <span className="koa:tabular-nums">
              <span>
                <span className="koa:font-bold koa:invisible">{"0".repeat(Math.max(total.toString().length - current.toString().length, 0))}</span>
                <span className="koa:whitespace-nowrap">
                  <strong>{current}</strong> / {total}
                </span>
              </span>
            </span>
          </div>
          <div className="koa:justify-self-end">
            <Button size="small" variant="link" color="neutral" onClick={onNextClick}>
              {nextButtonLabel}
              <Icon icon={mdiArrowRight} decorative={true} />
            </Button>
          </div>
        </div>
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
    </NavigationCard>
  );
}

QuestionNavigationCard.heightClassNames = HEIGHT;
