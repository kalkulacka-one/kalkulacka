import { useMemo } from "react";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";
import { type QuestionViewModel, questionViewModel } from "./question";

export type QuestionsViewModel = {
  questions: QuestionViewModel[];
  total: number;
};

export function questionsViewModel(questions: Question[]): QuestionsViewModel {
  return {
    questions: questions.map(questionViewModel),
    total: questions.length,
  };
}

export function useQuestions(): QuestionsViewModel {
  const questions = useCalculatorStore((state) => state.questions);
  return useMemo(() => questionsViewModel(questions), [questions]);
}
