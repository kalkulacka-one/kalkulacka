import type { AnswerViewModel, QuestionViewModel } from "../../../view-models";
import { QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
  answer: AnswerViewModel;
  onPreviousClick: () => void;
  onNextClick: () => void;
};

export function QuestionPage({ question, number, total, onPreviousClick, onNextClick, answer }: QuestionPage) {
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
      <QuestionCard question={question} current={number} total={total} />
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
    </>
  );
}
