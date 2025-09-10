import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { AnswersStore } from "../../stores/answers";
import { type AnswerViewModel, answerViewModel } from "./answer";

export type AnswersViewModel = {
  answers: AnswerViewModel[];
  setAnswer: AnswersStore["setAnswer"];
  clearAnswers: AnswersStore["clearAnswers"];
  answersMap: Map<string, boolean | null | undefined>;
};

export function answersViewModel(
  answers: Answer[],
  answersMap: Map<string, boolean | null | undefined>,
  setAnswer: AnswersStore["setAnswer"],
  clearAnswers: AnswersStore["clearAnswers"],
): AnswersViewModel {
  return {
    answers: answers.map((answer) => answerViewModel(answer, setAnswer)),
    answersMap,
    setAnswer,
    clearAnswers,
  };
}
