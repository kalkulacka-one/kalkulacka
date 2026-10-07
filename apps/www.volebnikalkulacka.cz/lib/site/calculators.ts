import { isPublished, loadCalculator, NotFoundError } from "@kalkulacka-one/app";

// The calculator groups this site renders. Interim: replace with the mechanism that lists which calculators render where.
export const CALCULATOR_GROUPS = ["senatni-2026", "komunalni-2026"];

export async function publishedCalculator({ endpoint, group, key, current }: { endpoint: string; group: string; key: string; current: Date }) {
  try {
    const calculator = await loadCalculator({ endpoint, key, group });
    return isPublished(calculator, current) ? calculator : undefined;
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      console.error(`Calculator \`${group}/${key}\` could not be loaded`, error);
    }
    return undefined;
  }
}
