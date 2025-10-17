import type { Question } from "../../../../../packages/schema/schemas/question.schema";

export type QuestionViewModel = Question;

export function questionViewModel(question: Question): QuestionViewModel {
  return question;
}
