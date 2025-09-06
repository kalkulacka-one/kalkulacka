import { notFound } from "next/navigation";

export function stepGuard(step: string): 1 | 2 {
  const number = Number.parseInt(step, 10);
  if (Number.isNaN(number) || (number !== 1 && number !== 2)) {
    notFound();
  }
  return number as 1 | 2;
}
