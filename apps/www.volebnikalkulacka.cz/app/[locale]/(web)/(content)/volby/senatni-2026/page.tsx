import type { Metadata } from "next";
import Link from "next/link";

import { type GroupCalculator, loadCalculatorGroup } from "@/lib/api/calculator-group";

const GROUP = "senatni-2026";

export async function generateMetadata(): Promise<Metadata> {
  const { electionName } = await loadCalculatorGroup({ group: GROUP });
  return { title: electionName };
}

type Region = { key: string; name: string; calculators: GroupCalculator[] };

/**
 * The constituencies under the region each one belongs to.
 *
 * A Senate constituency is named after a town, not a region, so "Louny" alone
 * does not tell a voter whether it is theirs; the region above it does.
 * Constituencies whose region the data does not give fall under one unnamed
 * heading rather than disappearing.
 */
function byRegion(calculators: GroupCalculator[]): Region[] {
  const regions = new Map<string, Region>();

  for (const calculator of calculators) {
    const key = calculator.region?.key ?? "";
    const region = regions.get(key) ?? { key, name: calculator.region?.name ?? "Ostatní obvody", calculators: [] };
    region.calculators.push(calculator);
    regions.set(key, region);
  }

  return [...regions.values()].sort((a, b) => a.name.localeCompare(b.name, "cs"));
}

/** "1. kolo" — shown once where every constituency is in the same round, which is the usual case. */
function roundLabel(calculators: GroupCalculator[]): string | undefined {
  const rounds = new Set(calculators.map((calculator) => calculator.round));
  const [round] = [...rounds];
  return rounds.size === 1 && round !== undefined ? `${round}. kolo` : undefined;
}

export default async function Page() {
  const group = await loadCalculatorGroup({ group: GROUP });
  const regions = byRegion(group.calculators);
  const sharedRound = roundLabel(group.calculators);

  return (
    <div className="relative min-h-screen bg-slate-50 z-0">
      {/* Background dashed lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full max-w-7xl px-6 sm:px-8">
          <div className="relative h-full grid grid-cols-6 gap-x-6">
            {Array.from({ length: 6 }, (_, i) => i).map((columnIndex) => (
              <div key={`bg-grid-col-${columnIndex}`} className="relative">
                <div className="absolute inset-y-0 left-0 border-l-2 border-dashed border-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <span aria-hidden>←</span> Zpět na hlavní stránku
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">{group.electionName}</h1>
          {sharedRound && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{sharedRound}</span>}
        </div>
        <p className="mt-4 max-w-prose text-slate-500">
          {group.selection?.description ?? "Senát se obměňuje po třetinách — volí se jen ve třetině obvodů. Najděte ten svůj a porovnejte se s jeho kandidáty a kandidátkami."}
        </p>

        <h2 className="mt-10 md:mt-12 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{group.selection?.title ?? "Zvolte svůj volební obvod"}</h2>
        <p className="mt-2 text-sm text-slate-500">Celkem {group.calculators.length} obvodů</p>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
          {regions.map((region) => (
            <section key={region.key || "bez-kraje"}>
              <h3 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-lg">{region.name}</h3>
              <ul className="mt-3 grid gap-2">
                {region.calculators.map((calculator) => (
                  <li key={calculator.key}>
                    <Link href={`/volby/${GROUP}/${calculator.key}`} className="flex items-baseline gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 hover:border-slate-300">
                      {(group.selection?.showCode ?? true) && calculator.districtCode && <span className="text-sm tabular-nums text-slate-500">{calculator.districtCode}.</span>}
                      <span className="font-semibold text-slate-700">{calculator.districtName}</span>
                      {!sharedRound && calculator.round !== undefined && <span className="ml-auto text-xs text-slate-500">{calculator.round}. kolo</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
