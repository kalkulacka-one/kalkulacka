import { loadCalculator, NotFoundError } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

import { calculatorPathGuard } from "./calculator-path";

export async function calculatorGuard({ endpoint, key, group, prefixed }: { endpoint: string; key: string; group?: string; prefixed: boolean }): Promise<void> {
  try {
    const calculator = await loadCalculator({ endpoint, key, group });
    calculatorPathGuard({ calculator, prefixed, group });
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
