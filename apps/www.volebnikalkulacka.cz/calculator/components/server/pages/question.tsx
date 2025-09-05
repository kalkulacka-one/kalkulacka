import { useState } from "react";

import type { QuestionViewModel } from "../../../view-models";
import { QuestionCard, QuestionNavigationCard } from "../components";

export type QuestionPage = {
  question: QuestionViewModel;
  number: number;
  total: number;
  onPreviousClick: () => void;
  onNextClick: () => void;
};

export function QuestionPage({ question, number, total, onPreviousClick, onNextClick }: QuestionPage) {
  const [answer, setAnswer] = useState({
    questionId: question.id,
    answer: null as boolean | null,
    isImportant: false,
  });

  const handleAgreeChange = (checked: boolean) => {
    setAnswer((prev) => ({
      ...prev,
      answer: checked ? true : null,
    }));
    onNextClick();
  };

  const handleDisagreeChange = (checked: boolean) => {
    setAnswer((prev) => ({
      ...prev,
      answer: checked ? false : null,
    }));
    onNextClick();
  };

  const handleImportantChange = (checked: boolean) => {
    setAnswer((prev) => ({
      ...prev,
      isImportant: checked,
    }));
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
