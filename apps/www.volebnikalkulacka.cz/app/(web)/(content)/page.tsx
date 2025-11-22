import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";
import { useId } from "react";

import { CalculatorCard } from "../../../calculator/components/server/components/calculator-card";
import type { CalculatorViewModel } from "../../../calculator/view-models/server/calculator";
import { BeadRow } from "./BeadRow";
import calculatorsData from "./calculators.json";

const calculators = calculatorsData as CalculatorViewModel[];
export default function Page() {
  const bgGridId = useId();
  const otherCalcsHeadingId = useId();
  const featuredCalculators = calculators.filter((calculator) => calculator.card?.featured);
  const otherCalculators = calculators.filter((calculator) => "variant" in calculator && (calculator.variant?.key === "expresni" || calculator.variant?.key === "ultimatni"));
  const thematicCalculators = calculators.filter(
    (calculator) => "variant" in calculator && (calculator.variant?.key === "pro-mlade" || calculator.variant?.key === "klimaticka" || calculator.variant?.key === "kompas"),
  );

  return (
    <div className="relative min-h-screen bg-slate-50 z-0">
      {/* Background dashed lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full max-w-7xl px-6 sm:px-8">
          <div id={bgGridId} className="relative h-full grid grid-cols-6 gap-x-6">
            {Array.from({ length: 6 }, (_, i) => i).map((columnIndex) => (
              <div key={`bg-grid-col-${columnIndex}`} className="relative">
                <div className="absolute inset-y-0 left-0 border-l-2 border-dashed border-slate-200" />
              </div>
            ))}
            <BeadRow />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
        {/* Heading */}
        <h1 className="font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Sněmovní volby 2025</h1>
        {/* Featured cards */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {featuredCalculators.map((calculator) => (
            <CalculatorCard key={calculator.id} calculator={calculator}>
              {calculator.card?.link && (
                <Link href={calculator.card.link} className="grid">
                  <Button variant={calculator.card.buttonVariant || "outline"} color="neutral">
                    {calculator.card.buttonText || "Spustit kalkulačku"}
                  </Button>
                </Link>
              )}
            </CalculatorCard>
          ))}
        </div>
        {/* Other calculators */}
        <h3 id={otherCalcsHeadingId} className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">
          Další volební kalkulačky
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {otherCalculators.map((calculator) => (
            <CalculatorCard key={calculator.id} calculator={calculator}>
              {calculator.card?.link && (
                <Link href={calculator.card.link} className="grid">
                  <Button variant={calculator.card.buttonVariant || "outline"} color="neutral">
                    {calculator.card.buttonText || "Spustit kalkulačku"}
                  </Button>
                </Link>
              )}
            </CalculatorCard>
          ))}
        </div>
        {/* Thematic calculators */}
        <h3 className="mt-12 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Tématické volební kalkulačky</h3>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {thematicCalculators.map((calculator) => (
            <CalculatorCard key={calculator.id} calculator={calculator}>
              {calculator.card?.link && (
                <Link href={calculator.card.link} className="grid">
                  <Button variant={calculator.card.buttonVariant || "outline"} color="neutral">
                    {calculator.card.buttonText || "Spustit kalkulačku"}
                  </Button>
                </Link>
              )}
            </CalculatorCard>
          ))}
        </div>

        {/* Archive section */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          <Card border className="h-full !border-slate-200 bg-slate-50/50">
            <div className="p-6 h-full flex flex-col">
              <p className="text-slate-600">Starší Volební kalkulačky najdete v archivu</p>
              <div className="grid mt-auto pt-4">
                <a href="https://archiv-2024.volebnikalkulacka.cz" target="_blank" rel="noopener noreferrer" className="grid">
                  <Button variant="link" color="neutral">
                    Přejít do archivu
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
        {/* Footer */}
        <div className="mt-16 border-t border-slate-200 pt-6 text-center text-slate-500">© 2025 Volební kalkulačka</div>
      </div>
    </div>
  );
}
