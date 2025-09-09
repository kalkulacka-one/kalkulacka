import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { AnswerViewModel, CalculatorViewModel, QuestionViewModel } from "../../../view-models";
import { WithCondenseOnScroll } from "../../client/app-header-with-scroll";
import { AppHeader, AppHeaderMain, AppHeaderRight, LayoutBottomNavigation, LayoutHeader, QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function QuestionPage({ question, number, total, calculator, onPreviousClick, onNextClick, answer, onCloseClick }: QuestionPage) {
  const handleAgreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: true,
      });
      onNextClick();
    }
  };

  const handleDisagreeChange = (checked: boolean) => {
    if (checked) {
      answer.setAnswer({
        questionId: question.id,
        answer: false,
      });
      onNextClick();
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
            <AppHeader condensed={condensed}>
              <AppHeaderMain title="Volební kalkulačka" secondaryTitle={calculator?.shortTitle} tertiaryTitle="Sněmovní volby 2025" />
              <AppHeaderRight>
                <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                  <Icon icon={mdiClose} size="medium" decorative />
                </Button>
              </AppHeaderRight>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </LayoutHeader>
      <QuestionCard question={question} current={number} total={total} />
      <LayoutBottomNavigation>
        <QuestionNavigationCard
          current={number}
          total={total}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
          answer={answer}
          onAgreeChange={handleAgreeChange}
          onDisagreeChange={handleDisagreeChange}
          onImportantChange={handleImportantChange}
        />
      </LayoutBottomNavigation>
    </>
  );
}
