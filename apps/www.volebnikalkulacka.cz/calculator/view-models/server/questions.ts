import type { Question } from "@repo/schema/schemas";

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
