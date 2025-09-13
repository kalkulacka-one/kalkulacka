import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import { HideOnEmbed } from "../../../../components/client";
import { canonical } from "../../../../lib/routing/url-builders";
import type { AnswerViewModel, CalculatorViewModel, QuestionViewModel } from "../../../view-models";
import { AppHeader, AppHeaderMain, AppHeaderRight, WithCondenseOnScroll } from "../../client";
import { LayoutBottomNavigation, LayoutContent, LayoutHeader, QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCloseClick: () => void;
  isEmbed?: boolean;
};

export function QuestionPage({ question, number, total, calculator, onPreviousClick, onNextClick, answer, onCloseClick, isEmbed }: QuestionPage) {
  const handleAgreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: true,
      });
      onNextClick();
    } else {
      answer.setAnswer({
        questionId: question.id,
        answer: undefined,
      });
    }
  };

  const handleDisagreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: false,
      });
      onNextClick();
    } else {
      answer.setAnswer({
        questionId: question.id,
        answer: undefined,
      });
    }
  };

  const handleImportantChange = (checked: boolean) => {
    answer.setAnswer({
      questionId: question.id,
      isImportant: checked,
    });
  };

  return (
    <>
      <LayoutHeader>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} logoTitle="Volební kalkulačka">
              <AppHeaderMain title="Volební kalkulačka" secondaryTitle={calculator?.shortTitle} tertiaryTitle="Sněmovní volby 2025" />
              <AppHeaderRight>
                <HideOnEmbed>
                  <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeaderRight>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </LayoutHeader>
      <LayoutContent>
        <QuestionCard question={question} current={number} total={total} />
      </LayoutContent>
      <LayoutBottomNavigation spacer="11rem">
        <QuestionNavigationCard
          current={number}
          total={total}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
          answer={answer}
          onAgreeChange={handleAgreeChange}
          onDisagreeChange={handleDisagreeChange}
          onImportantChange={handleImportantChange}
          attributionHref={isEmbed ? canonical.homepage() : undefined}
        />
      </LayoutBottomNavigation>
    </>
  );
}
