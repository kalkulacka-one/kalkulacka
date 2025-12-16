import { type CalculatorData, loadCalculatorData } from "@/data-fetching";
import { NotFoundError } from "@/errors";

export async function calculatorDataLoader({ endpoint, key, group, onNotFound }: { endpoint: string; key: string; group?: string; onNotFound: () => never }): Promise<CalculatorData> {
  try {
    return await loadCalculatorData({ endpoint, key, group });
  } catch (error) {
    if (error instanceof NotFoundError) {
      onNotFound();
    }
    throw error;
  }
}
