import type { AnswersStore } from "@/calculator/stores";

import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";

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
