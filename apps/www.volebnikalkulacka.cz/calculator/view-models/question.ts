import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";

export type QuestionViewModel = Question;

export function useQuestionViewModel(questionNumber: number): QuestionViewModel {
  const questions = useCalculatorStore((state) => state.calculator.questions);
  const question = questions[questionNumber - 1];
  if (!question) {
    throw new Error(`Question ${questionNumber} not found`);
  }
  return question;
}
