import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { type AnswersStore, useAnswersStore } from "../stores/answers";
import type { AnswerViewModel } from ".";

export type AnswersViewModel = {
  answers: AnswerViewModel[];
  setAnswer: AnswersStore["setAnswer"];
  clearAnswers: AnswersStore["clearAnswers"];
};

export function useAnswersViewModel(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return {
    answers: answers.map(
      (answer: Answer): AnswerViewModel => ({
        answer,
        setAnswer,
      }),
    ),
    setAnswer,
    clearAnswers,
  };
}
