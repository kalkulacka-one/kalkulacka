import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";

export type QuestionViewModel = Question;

export function useQuestionsViewModel(): { questions: Question[]; total: number } {
  const questions = useCalculatorStore((state) => state.calculator.questions);
  return {
    questions,
    total: questions.length,
  };
}
