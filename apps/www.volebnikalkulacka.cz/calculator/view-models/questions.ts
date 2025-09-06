import { useCalculatorStore } from "../stores";
import type { QuestionViewModel } from "./question";

export type QuestionsViewModel = {
  questions: QuestionViewModel[];
  total: number;
};

export function useQuestionsViewModel(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.calculator.questions);
  return {
    questions,
    total: questions.length,
  };
}
