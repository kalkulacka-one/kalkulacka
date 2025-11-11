import type { Question } from "@repo/schema/schemas";

export type QuestionViewModel = Question;

export function questionViewModel(question: Question): QuestionViewModel {
  return question;
}
