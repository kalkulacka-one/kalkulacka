import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { type AnswersStore, useAnswersStore } from "../stores/answers";
import { type AnswerViewModel, answerViewModel } from "./answer";

export type AnswersViewModel = {
  answers: AnswerViewModel[];
  setAnswer: AnswersStore["setAnswer"];
  clearAnswers: AnswersStore["clearAnswers"];
};

export function answersViewModel(answers: Answer[], setAnswer: AnswersStore["setAnswer"], clearAnswers: AnswersStore["clearAnswers"]): AnswersViewModel {
  return {
    answers: answers.map((answer) => answerViewModel(answer, setAnswer)),
    setAnswer,
    clearAnswers,
  };
}

export function useAnswersViewModel(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers), [answers, setAnswer, clearAnswers]);
}
