import type { AnswersStore } from "@/stores";

import type { Answer } from "../../../../schema/schemas/answer.schema";
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
