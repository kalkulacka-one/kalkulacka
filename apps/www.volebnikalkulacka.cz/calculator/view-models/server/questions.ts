import type { Question } from "@kalkulacka-one/schema";

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
