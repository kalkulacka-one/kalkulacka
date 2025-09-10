import { useMemo } from "react";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { type AnswersStore, useAnswersStore } from "../stores/answers";
import { type AnswerViewModel, answerViewModel } from "./answer";

export type AnswersViewModel = {
  answers: AnswerViewModel[];
  answersMap: Map<string, boolean | null | undefined>;
  setAnswer: AnswersStore["setAnswer"];
  clearAnswers: AnswersStore["clearAnswers"];
};

export function answersViewModel(
  answers: Answer[],
  setAnswer: AnswersStore["setAnswer"],
  clearAnswers: AnswersStore["clearAnswers"],
  answersMap: Map<string, boolean | null | undefined>,
): AnswersViewModel {
  return {
    answers: answers.map((answer) => answerViewModel(answer, setAnswer)),
    answersMap,
    setAnswer,
    clearAnswers,
  };
}

export function useAnswersViewModel(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  const answersMap = useMemo(() => new Map(answers.map((a) => [a.questionId, a.answer])), [answers]);

  return useMemo(() => answersViewModel(answers, setAnswer, clearAnswers, answersMap), [answers, setAnswer, clearAnswers, answersMap]);
}
