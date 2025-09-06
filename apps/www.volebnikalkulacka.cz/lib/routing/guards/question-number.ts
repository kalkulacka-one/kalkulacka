import { notFound } from "next/navigation";

export function questionNumberGuard(questionNumber: string): number {
  const number = Number.parseInt(questionNumber, 10);
  if (Number.isNaN(number) || number < 1) {
    notFound();
  }
  return number;
}
