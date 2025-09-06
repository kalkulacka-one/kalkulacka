import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import { useAnswersStore } from "../stores/answers";

export type AnswersViewModel = {
  answers: Answer[];
  clearAnswers: () => void;
};

export function useAnswersViewModel(): AnswersViewModel {
  const answers = useAnswersStore((state) => state.answers);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  return {
    answers,
    clearAnswers,
  };
}
