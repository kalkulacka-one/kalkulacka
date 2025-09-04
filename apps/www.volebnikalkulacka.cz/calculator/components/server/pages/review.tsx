import type { CalculatorViewModel } from "../../../view-models";
import { ReviewNavigationCard, ReviewQuestionCard } from "../components";

export type ReviewPage = {
  calculator: CalculatorViewModel;
  onNavigationNextClick: () => void;
};

export function ReviewPage({ onNavigationNextClick }: ReviewPage) {
  // Mock questions and answers - TODO: Replace with actual data
  const mockQuestions = [
    {
      id: "question-1",
      title: "Otázka 1",
      statement: "Toto je otázka číslo 1",
      detail: "Detail k otázce 1",
      tags: ["tag1", "tag2"],
    },
    {
      id: "question-2",
      title: "Otázka 2",
      statement: "Toto je otázka číslo 2",
      detail: "Detail k otázce 2",
      tags: ["tag3", "tag4"],
    },
    {
      id: "question-3",
      title: "Otázka 3",
      statement: "Toto je otázka číslo 3",
      detail: "Detail k otázce 3",
      tags: ["tag5", "tag6"],
    },
  ];

  const mockAnswers = [
    { questionId: "question-1", answer: true, isImportant: false },
    { questionId: "question-2", answer: false, isImportant: true },
    { questionId: "question-3", answer: null, isImportant: false },
  ];

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
      {mockQuestions.map((question, index) => {
        const answer = mockAnswers[index];
        if (!answer) return null;
        
        return (
          <ReviewQuestionCard
            key={question.id}
            question={question}
            answer={answer}
            current={index + 1}
            total={3}
            onAgreeChange={handleAgreeChange}
            onDisagreeChange={handleDisagreeChange}
            onImportantChange={handleImportantChange}
          />
        );
      })}
      <ReviewNavigationCard onNextClick={onNavigationNextClick} />
    </>
  );
}
