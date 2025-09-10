import { mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { AnswersViewModel, AnswerViewModel, CalculatorViewModel, QuestionsViewModel, QuestionViewModel } from "../../../view-models";
import { WithCondenseOnScroll } from "../../client/app-header-with-scroll";
import { AppHeader, AppHeaderMain, AppHeaderRight, LayoutBottomNavigation, LayoutContent, LayoutHeader, QuestionCard, QuestionNavigationCard, QuestionProgressBar } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  questions: QuestionsViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  answers: AnswersViewModel;
  calculator: CalculatorViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function QuestionPage({ question, questions, number, total, calculator, onPreviousClick, onNextClick, answer, answers, onCloseClick }: QuestionPage) {
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
      <LayoutContent>
        <QuestionCard question={question} current={number} total={total} />
        <QuestionProgressBar questions={questions} current={number} answers={answers} />
      </LayoutContent>
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
