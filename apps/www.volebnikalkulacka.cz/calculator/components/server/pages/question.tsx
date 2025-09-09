import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { AnswerViewModel, CalculatorViewModel, QuestionViewModel } from "../../../view-models";
import { AppHeader, AppHeaderMain, AppHeaderRight } from "../../client";
import { LayoutBottomNavigation, LayoutHeader, QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  calculator?: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
};

export function QuestionPage({ question, number, total, onPreviousClick, onNextClick, answer, calculator }: QuestionPage) {
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
        <AppHeader>
          <AppHeaderMain />
          <AppHeaderRight>
            <Button variant="link" color="neutral" size="small" aria-label="Close">
              <Icon icon={mdiClose} size="medium" decorative />
            </Button>
          </AppHeaderRight>
        </AppHeader>
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
