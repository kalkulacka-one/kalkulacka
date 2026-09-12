// The Slovak counterpart of the Czech app's `config/calculator-names.ts`

/**
 * Display names for the shell and the introduction.
 *
 * The Czech app keys these by election group and calculator key, because a
 * group calculator's `calculator.json` carries no display name. This site
 * runs one standalone calculator (`inventura-2023-2025`), and a standalone
 * calculator's data does carry its own `title` and `shortTitle` — so the
 * names come from the data, with the same shape the screens expect. There is
 * no election to name: a standalone calculator sits in no group, and the
 * header shows the app title on its own.
 */

export type CalculatorNames = {
  /** The election's display name; absent for a standalone calculator, which belongs to no election group. */
  electionName?: string;
  /** The calculator's display name — the introduction's heading. */
  calculatorName: string;
};

/**
 * The names for a calculator, from the data's own `title` — or, failing that,
 * its `shortTitle`, or the key itself.
 */
export function calculatorNames({ key, title, shortTitle }: { key?: string; title?: string; shortTitle?: string }): CalculatorNames {
  return {
    electionName: undefined,
    calculatorName: title || shortTitle || key || "",
  };
}
