import type { Question } from "@kalkulacka-one/schema/schemas/question.schema";

export type QuestionViewModel = Question;

export function questionViewModel(question: Question): QuestionViewModel {
  return question;
}
