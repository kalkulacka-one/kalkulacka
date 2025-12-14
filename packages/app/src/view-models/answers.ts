import type { Answer } from "@kalkulacka-one/schema";

import type { AnswersStore } from "@kalkulacka-one/app/client";

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
