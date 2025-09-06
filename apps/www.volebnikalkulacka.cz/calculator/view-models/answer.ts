import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { useAnswersStore } from "../stores/answers";

export type AnswerViewModel = {
  answer: Answer | undefined;
  setAnswer: (answer: Answer) => void;
};

export function useAnswerViewModel(questionId: string): AnswerViewModel {
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const getAnswer = useAnswersStore((state) => state.getAnswer);

  return {
    answer: getAnswer(questionId),
    setAnswer,
  };
}
