import type { Question } from "@kalkulacka-one/schema";

export type QuestionViewModel = Question & {
  /** Not asked in the current round: the candidates still in the race do not differ on it. */
  settled?: boolean;
};

export function questionViewModel(question: Question, settled = false): QuestionViewModel {
  return settled ? { ...question, settled } : question;
}
