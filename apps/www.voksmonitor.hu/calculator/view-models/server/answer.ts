import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { AnswersStore } from "../../stores/answers";

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
