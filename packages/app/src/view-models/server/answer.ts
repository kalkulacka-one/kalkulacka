import type { AnswersStore } from "@/stores";

import type { Answer } from "../../../../schema/schemas/answer.schema";

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
