// Ported from kalkulacka-2026/apps/web/config/site.ts (the display names only)

/**
 * Display names for the shell and the introduction.
 *
 * The data serves no election title at all, and a group calculator's
 * `calculator.json` (e.g. `snemovni-2025/kalkulacka`) carries neither `title`
 * nor `shortTitle` — the previous platform hardcoded its homepage links
 * instead. So the names are site configuration, keyed by the group key and the
 * calculator key the data is published under.
 */

export type CalculatorNames = {
  /** The election's display name, e.g. "Sněmovní volby 2025"; absent for a calculator outside a known group. */
  electionName?: string;
  /** The calculator's display name — the introduction's heading. */
  calculatorName: string;
};

type ElectionNames = {
  name: string;
  calculators: Record<string, string>;
};

/*
 * Display names below are provisional — taken from the previous platform's
 * homepage, not from data.
 */
const ELECTIONS: Record<string, ElectionNames> = {
  "snemovni-2025": {
    name: "Sněmovní volby 2025",
    calculators: {
      kalkulacka: "Volební kalkulačka",
      expresni: "Expresní kalkulačka",
      "pro-mlade": "Kalkulačka pro mladé",
      ultimatni: "Ultimátní kalkulačka",
      inventura: "Inventura hlasování",
      klimaticka: "Klimatická kalkulačka",
      kompas: "Volební kompas",
    },
  },
};

/**
 * The names for a calculator, from the config where it is listed and from the
 * data's own `title` / `shortTitle` (passed as `fallback`) — or, failing both,
 * the key itself — where it is not.
 */
export function calculatorNames({ group, key, fallback }: { group?: string; key?: string; fallback?: string }): CalculatorNames {
  const election = group ? ELECTIONS[group] : undefined;
  const configured = key ? election?.calculators[key] : undefined;

  return {
    electionName: election?.name,
    calculatorName: configured ?? fallback ?? key ?? "",
  };
}
