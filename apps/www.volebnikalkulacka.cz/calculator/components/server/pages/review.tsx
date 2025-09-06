import { useState } from "react";

import type { QuestionsViewModel } from "../../../view-models";
import { ReviewNavigationCard, ReviewQuestionCard } from "../components";

export type ReviewPage = {
  questions: QuestionsViewModel;
  onNextClick: () => void;
  onPreviousClick: () => void;
};

export function ReviewPage({ questions, onNextClick, onPreviousClick }: ReviewPage) {
  const [mockAnswers, setMockAnswers] = useState<Record<string, { answer: boolean | null; isImportant: boolean }>>({});

  const handleAgreeChange = (questionId: string, agree: boolean) => {
    setMockAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: agree ? true : null,
        isImportant: prev[questionId]?.isImportant || false,
      },
    }));
  };

  const handleDisagreeChange = (questionId: string, disagree: boolean) => {
    setMockAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: disagree ? false : null,
        isImportant: prev[questionId]?.isImportant || false,
      },
    }));
  };

  const handleImportantChange = (questionId: string, isImportant: boolean) => {
    setMockAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answer: prev[questionId]?.answer || null,
        isImportant,
      },
    }));
  };

  return (
    <>
      {questions.questions.map((question, index) => {
        const answer = {
          questionId: question.id,
          answer: mockAnswers[question.id]?.answer || null,
          isImportant: mockAnswers[question.id]?.isImportant || false,
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
      <ReviewNavigationCard onPreviousClick={onPreviousClick} onNextClick={onNextClick} />
    </>
  );
}
