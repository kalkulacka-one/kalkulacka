import { type CalculatorData, loadCalculatorData } from "@/data-fetching";
import { NotFoundError } from "@/errors";

export async function calculatorDataLoader({ endpoint, key, group, onNotFound }: { endpoint: string; key: string; group?: string; onNotFound: () => never }): Promise<CalculatorData> {
  try {
    const calculatorData = await loadCalculatorData({ endpoint, key, group });
    return calculatorData;
  } catch (error) {
    if (error instanceof NotFoundError) {
      onNotFound();
    }
    throw error;
  }
}
