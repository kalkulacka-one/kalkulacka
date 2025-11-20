import type { AnswersStore } from "@/calculator/stores/answers";

import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
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
