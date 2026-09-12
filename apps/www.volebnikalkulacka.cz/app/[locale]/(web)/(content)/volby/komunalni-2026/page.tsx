import type { Metadata } from "next";
import Link from "next/link";

import { type GroupCalculator, loadCalculatorGroup } from "@/lib/api/calculator-group";

import { CalculatorSearch, type SearchableCalculator } from "../CalculatorSearch";

const GROUP = "komunalni-2026";

export async function generateMetadata(): Promise<Metadata> {
  const { electionName } = await loadCalculatorGroup({ group: GROUP });
  return { title: electionName };
}

/**
 * One row per city, with the city's other calculators — its Inventura
 * hlasování — hanging off that row rather than competing with it in the list.
 */
function citiesWithVariants(calculators: GroupCalculator[]): SearchableCalculator[] {
  const cities = new Map<string, SearchableCalculator>();

  for (const calculator of calculators.filter((calculator) => !calculator.variantKey)) {
    cities.set(calculator.districtKey, { key: calculator.key, districtName: calculator.districtName, districtCode: calculator.districtCode, variants: [] });
  }

  for (const calculator of calculators.filter((calculator) => calculator.variantKey)) {
    // A variant of a city the group does not otherwise cover still deserves a
    // row of its own rather than being dropped for having no parent.
    const city = cities.get(calculator.districtKey);
    const name = calculator.variantKey === "inventura" ? "Inventura hlasování" : (calculator.variantKey ?? calculator.key);
    if (city) {
      city.variants?.push({ key: calculator.key, name });
    } else {
      cities.set(calculator.districtKey, { key: calculator.key, districtName: `${calculator.districtName} — ${name}`, districtCode: calculator.districtCode, variants: [] });
    }
  }

  return [...cities.values()];
}

export default async function Page() {
  const group = await loadCalculatorGroup({ group: GROUP });
  const cities = citiesWithVariants(group.calculators);

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

        <h1 className="mt-4 font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">{group.electionName}</h1>
        <p className="mt-4 max-w-prose text-slate-500">{group.selection?.description ?? "Komunální kalkulačka je pro každé město jiná — vyberte to své a porovnejte se s kandidujícími uskupeními."}</p>

        <h2 className="mt-10 md:mt-12 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{group.selection?.title ?? "Zvolte své město"}</h2>

        <div className="mt-6">
          <CalculatorSearch
            calculators={cities}
            basePath={`/volby/${GROUP}`}
            label={group.selection?.title ?? "Zvolte své město"}
            placeholder={group.selection?.searchPlaceholder ?? "Hledat město…"}
            showCode={group.selection?.showCode ?? false}
          />
        </div>
      </div>
    </div>
  );
}
