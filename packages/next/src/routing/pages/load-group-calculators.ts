import { loadCalculator, NotFoundError } from "@kalkulacka-one/app";
import type { Calculator } from "@kalkulacka-one/schema";

export async function loadGroupCalculators({ endpoint, group, keys }: { endpoint: string; group: string; keys: string[] }): Promise<Record<string, Calculator>> {
  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        return [key, await loadCalculator({ endpoint, key, group })] as const;
      } catch (error) {
        if (!(error instanceof NotFoundError)) console.error(`Calculator \`${group}/${key}\` could not be loaded`, error);
        return undefined;
      }
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== undefined));
}
