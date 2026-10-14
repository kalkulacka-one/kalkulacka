import { type CalculatorData, loadCalculatorData, NotFoundError } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

import { now } from "@/routing/clock";

export async function dataLoaderGuard({ endpoint, key, group }: { endpoint: string; key: string; group?: string }): Promise<CalculatorData> {
  try {
    const calculatorData = await loadCalculatorData({ endpoint, key, group });
    return { ...calculatorData, now: now().toISOString() };
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
