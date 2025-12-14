import { NavigationCard } from "@kalkulacka-one/app";
import { Button, Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";

import { mdiArrowLeft, mdiArrowRight, mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel } from "@/calculator";

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
  const t = useTranslations("calculator");
  const previousButtonLabel = current === 1 ? t("components.question-navigation-card.guide") : t("components.question-navigation-card.previous");
  const nextButtonLabel = answer.answer?.answer !== undefined ? t("components.question-navigation-card.next") : t("components.question-navigation-card.skip");

  return (
    <NavigationCard>
      <div className="grid grid-flow-row gap-2 sm:gap-3">
        <div className="grid grid-cols-[1fr_1fr] @[350px]:grid-cols-[minmax(8rem,1fr)_auto_minmax(8rem,1fr)] gap-1 @sm:gap-2 items-center">
          <div className="justify-self-start">
            <Button size="small" variant="link" color="neutral" onClick={onPreviousClick}>
              <Icon icon={mdiArrowLeft} decorative={true} />
              {previousButtonLabel}
            </Button>
          </div>
          <div className="justify-self-center hidden @[350px]:block">
            <span className="tabular-nums">
              <span>
                <span className="font-bold invisible">{"0".repeat(Math.max(total.toString().length - current.toString().length, 0))}</span>
                <span className="whitespace-nowrap">
                  <strong>{current}</strong> / {total}
                </span>
              </span>
            </span>
          </div>
          <div className="justify-self-end">
            <Button size="small" variant="link" color="neutral" onClick={onNextClick}>
              {nextButtonLabel}
              <Icon icon={mdiArrowRight} decorative={true} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-stretch">
          <ToggleButton
            color="neutral"
            variant="link"
            checked={answer.answer?.isImportant || false}
            onChange={(checked: boolean) => onImportantChange(checked)}
            aria-label={t("components.question-navigation-card.important")}
          >
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)}>
            <Icon icon={logoCheck} decorative={true} />
            {t("components.question-navigation-card.yes")}
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)}>
            <Icon icon={logoCross} decorative={true} />
            {t("components.question-navigation-card.no")}
          </ToggleButton>
        </div>
      </div>
    </NavigationCard>
  );
}

QuestionNavigationCard.heightClassNames = HEIGHT;
