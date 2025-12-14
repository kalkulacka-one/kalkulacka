import { type QuestionViewModel, questionViewModel } from "@kalkulacka-one/app";
import type { Question } from "@kalkulacka-one/schema";

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
