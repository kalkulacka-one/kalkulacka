import { notFound } from "next/navigation";

export function stepGuard(step: string): 1 | 2 {
  const stepInt = Number.parseInt(step, 10);
  if (Number.isNaN(stepInt) || (stepInt !== 1 && stepInt !== 2)) {
    notFound();
  }
  return stepInt as 1 | 2;
}
