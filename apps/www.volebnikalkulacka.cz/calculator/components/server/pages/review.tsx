import type { AnswersViewModel, QuestionsViewModel } from "../../../view-models";
import { AppHeader, LayoutBottomNavigation, LayoutHeader, ReviewNavigationCard, ReviewQuestionCard } from "../components";

export type ReviewPage = {
  questions: QuestionsViewModel;
  answers: AnswersViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
};

export function ReviewPage({ questions, answers, onNextClick, onPreviousClick }: ReviewPage) {
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
          <h1>Volební kalkulačka</h1>
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
        <ReviewNavigationCard onNextClick={onNextClick} />
      </LayoutBottomNavigation>
    </>
  );
}
