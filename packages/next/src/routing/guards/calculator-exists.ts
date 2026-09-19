import { loadCalculator, NotFoundError } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";

export async function calculatorExistsGuard({ endpoint, key, group }: { endpoint: string; key: string; group?: string }): Promise<void> {
  try {
    await loadCalculator({ endpoint, key, group });
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
