import { useCalculatorStore } from "../stores";
import type { QuestionViewModel } from "./question";

export type QuestionsViewModel = {
  questions: QuestionViewModel[];
  total: number;
};

export function useQuestionsViewModel(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.questions);
  return {
    questions,
    total: questions.length,
  };
}
