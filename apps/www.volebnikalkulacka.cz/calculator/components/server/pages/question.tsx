import type { CalculatorViewModel } from "../../../view-models";
import { QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  calculator: CalculatorViewModel;
  questionNumber: number;
  onNavigationNextClick: () => void;
  onNavigationPreviousClick: () => void;
  onNavigationResultsClick: () => void;
};

export function QuestionPage({ questionNumber, onNavigationNextClick, onNavigationPreviousClick }: QuestionPage) {
  // Mock question data - TODO: Replace with actual data fetching
  const mockQuestion = {
    id: `question-${questionNumber}`,
    title: `Otázka ${questionNumber}`,
    statement: `Toto je otázka číslo ${questionNumber}`,
    detail: `Detail k otázce ${questionNumber}`,
    tags: ["tag1", "tag2"],
  };

  // Mock answer data - TODO: Replace with actual answer state
  const mockAnswer = {
    questionId: `question-${questionNumber}`,
    answer: null,
    isImportant: false,
  };

  const handleAgreeChange = () => {
    // TODO: Implement answer handling
  };

  const handleDisagreeChange = () => {
    // TODO: Implement answer handling
  };

  const handleImportantChange = () => {
    // TODO: Implement answer handling
  };

  return (
    <>
      <QuestionCard question={mockQuestion} current={questionNumber} total={3} />
      <QuestionNavigationCard
        current={questionNumber}
        total={3}
        onNextClick={onNavigationNextClick}
        onPreviousClick={onNavigationPreviousClick}
        answer={mockAnswer}
        onAgreeChange={handleAgreeChange}
        onDisagreeChange={handleDisagreeChange}
        onImportantChange={handleImportantChange}
      />
    </>
  );
}
