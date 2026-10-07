import { ifFound, isPublished, loadCalculator, loadCalculatorGroup, NotFoundError } from "@kalkulacka-one/app";
import type { Calculator, CalculatorGroup } from "@kalkulacka-one/schema";

export type PublishedCalculator = { item: CalculatorGroup["calculators"][number]; calculator: Calculator };

async function safeLoadCalculator({ endpoint, group, key }: { endpoint: string; group?: string; key: string }): Promise<Calculator | undefined> {
  try {
    return await loadCalculator({ endpoint, key, group });
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      console.error(`Calculator \`${group ? `${group}/` : ""}${key}\` could not be loaded`, error);
    }
    return undefined;
  }
}

/** Published calculators of a calculator group, in the group's order – the same set the district picker offers */
export async function loadPublishedCalculators({ endpoint, group, current }: { endpoint: string; group: string; current: Date }): Promise<PublishedCalculator[] | undefined> {
  const calculatorGroup = await ifFound(loadCalculatorGroup({ endpoint, group }));
  if (!calculatorGroup) return undefined;
  const calculators = await Promise.all(calculatorGroup.calculators.map(async (item) => ({ item, calculator: await safeLoadCalculator({ endpoint, group, key: item.key }) })));
  return calculators.flatMap(({ item, calculator }) => (calculator && isPublished(calculator, current) ? [{ item, calculator }] : []));
}

/** A calculator listed by key is live unless it is scheduled for later; older calculators carry no `publishedAt` */
export async function loadListedCalculator({ endpoint, group, key, current }: { endpoint: string; group?: string; key: string; current: Date }): Promise<Calculator | undefined> {
  const calculator = await safeLoadCalculator({ endpoint, group, key });
  if (!calculator) return undefined;
  return !calculator.publishedAt || isPublished(calculator, current) ? calculator : undefined;
}
