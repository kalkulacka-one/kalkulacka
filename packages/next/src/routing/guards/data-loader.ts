import { type CalculatorData, loadCalculatorData, NotFoundError } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

export async function dataLoaderGuard({ endpoint, key, group }: { endpoint: string; key: string; group?: string }): Promise<CalculatorData> {
  try {
    return await loadCalculatorData({ endpoint, key, group });
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
