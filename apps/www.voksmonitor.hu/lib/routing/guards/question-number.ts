import { notFound } from "next/navigation";

export function validateQuestionNumber(questionNumber: string): number | null {
  const number = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(number) || number < 1) {
    return null;
  }
  return number;
}

export function questionNumberGuard(questionNumber: string): number {
  const validatedNumber = validateQuestionNumber(questionNumber);
  if (validatedNumber === null) {
    notFound();
  }
  return validatedNumber;
}
