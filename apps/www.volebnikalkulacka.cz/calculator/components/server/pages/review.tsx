import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";

import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel } from "../../../view-models";
import { AppHeader, AppHeaderMain, AppHeaderRight, AppHeaderBottomLeft, AppHeaderBottomMain } from "../../client";
import { LayoutBottomNavigation, LayoutHeader, ReviewNavigationCard, ReviewQuestionCard } from "../components";

export type ReviewPage = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  calculator?: CalculatorViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
};

export function ReviewPage({ questions, answers, calculator, onNextClick, onPreviousClick }: ReviewPage) {
  const handleAgreeChange = (questionId: string, agree: boolean) => {
    if (agree) {
      answers.setAnswer({
        questionId,
        answer: true,
      });
    }
  };

  const handleDisagreeChange = (questionId: string, disagree: boolean) => {
    if (disagree) {
      answers.setAnswer({
        questionId,
        answer: false,
      });
    }
  };

  const handleImportantChange = (questionId: string, isImportant: boolean) => {
    answers.setAnswer({
      questionId,
      isImportant,
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
          <AppHeaderBottomLeft>
            <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Back">
              <Icon icon={mdiArrowLeft} size="medium" decorative />
            </Button>
          </AppHeaderBottomLeft>
          <AppHeaderBottomMain>
            Rekapitulace
          </AppHeaderBottomMain>
        </AppHeader>
      </LayoutHeader>
      {questions.questions.map((question, index) => {
        const answer = answers.answers.find((a) => a.answer?.questionId === question.id) || {
          answer: undefined,
          setAnswer: answers.setAnswer,
        };

        return (
          <ReviewQuestionCard
            key={question.id}
            question={question}
            answer={answer}
            current={index + 1}
            total={questions.total}
            onAgreeChange={(agree) => handleAgreeChange(question.id, agree)}
            onDisagreeChange={(disagree) => handleDisagreeChange(question.id, disagree)}
            onImportantChange={(isImportant) => handleImportantChange(question.id, isImportant)}
          />
        );
      })}
      <LayoutBottomNavigation>
        <ReviewNavigationCard onPreviousClick={onPreviousClick} onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
