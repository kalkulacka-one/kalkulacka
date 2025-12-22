import { notFound } from "next/navigation";

import { validateQuestionNumber } from "@/routing/validators";

export function questionNumberGuard(questionNumber: string): number {
  try {
    return validateQuestionNumber(questionNumber);
  } catch {
    notFound();
  }
}
