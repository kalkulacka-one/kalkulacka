import type { Question } from "@kalkulacka-one/schema";

export type QuestionViewModel = Question;

export function questionViewModel(question: Question): QuestionViewModel {
  return question;
}
