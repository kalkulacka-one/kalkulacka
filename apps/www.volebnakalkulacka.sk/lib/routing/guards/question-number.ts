import { notFound } from "next/navigation";

import { validateQuestionNumber } from "../validators/question-number";

export function questionNumberGuard(questionNumber: string): number {
  try {
    return validateQuestionNumber(questionNumber);
  } catch {
    notFound();
  }
}
