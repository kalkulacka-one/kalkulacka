import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { type AnswersStore, useAnswersStore } from "../stores/answers";

export type AnswerViewModel = {
  answer: Answer | undefined;
  setAnswer: AnswersStore["setAnswer"];
};

export function answerViewModel(answer: Answer | undefined, setAnswer: AnswersStore["setAnswer"]): AnswerViewModel {
  return {
    answer,
    setAnswer,
  };
}

export function useAnswerViewModel(questionId: string): AnswerViewModel {
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const answers = useAnswersStore((state) => state.answers);

  return useMemo(() => {
    const answer = answers.find((answer) => answer.questionId === questionId);
    return answerViewModel(answer, setAnswer);
  }, [answers, questionId, setAnswer]);
}
