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
  /**
   * Display names for the calculators of an election whose calculators are
   * told apart by a variant (`snemovni-2025/expresni`). Elections whose
   * calculators are told apart by a district (`komunalni-2026/beroun`) name
   * them from the data instead — the district titles in `election.json` — so
   * they list no calculators here.
   */
  calculators?: Record<string, string>;
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
  // District elections: one calculator per city / constituency, named from the
  // data. Only the election's own name is configuration.
  "komunalni-2026": {
    name: "Komunální volby 2026",
  },
  "senatni-2026": {
    name: "Senátní volby 2026",
  },
};

/** The display name of an election, by its calculator group key. */
export function electionName(group: string): string | undefined {
  return ELECTIONS[group]?.name;
}

/**
 * The names for a calculator, from the config where it is listed and from the
 * data's own `title` / `shortTitle` (passed as `fallback`) — or, failing both,
 * the key itself — where it is not.
 */
export function calculatorNames({ group, key, fallback }: { group?: string; key?: string; fallback?: string }): CalculatorNames {
  const election = group ? ELECTIONS[group] : undefined;
  const configured = key ? election?.calculators?.[key] : undefined;

  return {
    electionName: election?.name,
    calculatorName: configured ?? fallback ?? key ?? "",
  };
}
