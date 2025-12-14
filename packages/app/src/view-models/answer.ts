import type { Answer } from "@kalkulacka-one/schema";

import type { AnswersStore } from "@kalkulacka-one/app/client";

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
