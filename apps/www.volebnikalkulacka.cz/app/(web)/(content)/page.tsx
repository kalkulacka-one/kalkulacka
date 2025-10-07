import { Button } from "@repo/design-system/client";
import { Badge, Card } from "@repo/design-system/server";
import Link from "next/link";
import { useId } from "react";

import { CalculatorCard, CalculatorCardCTA, CalculatorCardDescription, CalculatorCardHeader, CalculatorCardTitle } from "../../../calculator/components/server/components/calculator-card";
import { BeadRow } from "./BeadRow";

export default function Page() {
  const bgGridId = useId();
  const otherCalcsHeadingId = useId();

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
          {/* Left featured */}
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="primary">Nejoblíbenější kalkulačka</Badge>
                <Badge color="neutral">42 otázek</Badge>
                <Badge color="neutral">10 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kdo zastává vaše postoje?</h2>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">Klasická Volební kalkulačka, jak ji znáte už skoro 20 let.</p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/kalkulacka" className="grid">
                <Button variant="fill" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
          {/* Right featured */}
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="secondary">Inventura hlasování</Badge>
                <Badge color="neutral">35 hlasování</Badge>
                <Badge color="neutral">10 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kdo vás zastupoval ve Sněmovně?</h2>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">Žádné sliby, ale skutečná hlasování poslanců ve Sněmovně za končící volební období.</p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/inventura" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit inventuru hlasování
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
        </div>
        {/* Other calculators */}
        <h3 id={otherCalcsHeadingId} className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">
          Další volební kalkulačky
        </h3>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="yellow">Expresní kalkulačka</Badge>
                <Badge color="neutral">25 otázek</Badge>
                <Badge color="neutral">5 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h4 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Nejužitečnějších 5 minut před volbami</h4>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">Těch 25 nejklíčovějších otázek, které vám zaberou jen 5 minut.</p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/expresni" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="green">Ultimátní kalkulačka</Badge>
                <Badge color="neutral">100 otázek</Badge>
                <Badge color="neutral">30 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h4 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Všech 100 otázek pro „politické fajnšmekry"</h4>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">Nejrozsáhlější verze se všemi 100 otázkami, na které jsme se ptali.</p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/ultimatni" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
        </div>

        {/* Thematic calculators */}
        <h3 className="mt-12 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Tématické volební kalkulačky</h3>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="primary">Pro mladé</Badge>
                <Badge color="neutral">35 otázek</Badge>
                <Badge color="neutral">10 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h4 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">35 otázek, které pálí nejen mladou generaci</h4>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">
                Témata, která podle výzkumu pálí mladou generaci. Ve spolupráci s{" "}
                <a href="https://dikyzemuzem.cz" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
                  Díky, že můžem
                </a>
                .
              </p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/pro-mlade" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="green">Klimatická</Badge>
                <Badge color="neutral">20 otázek</Badge>
                <Badge color="neutral">5 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h4 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Kdo má plán pro klima?</h4>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">
                Výběr otázek ke klimatické změně:  povolenky, energetika, doprava. Ve spolupráci s{" "}
                <a href="https://faktaoklimatu.cz" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
                  Fakty o klimatu
                </a>
                .
              </p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/klimaticka" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
          <CalculatorCard>
            <CalculatorCardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="secondary">Volební kompas</Badge>
                <Badge color="neutral">25 otázek</Badge>
                <Badge color="neutral">10 minut</Badge>
              </div>
            </CalculatorCardHeader>
            <CalculatorCardTitle>
              <h4 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Kdo sdílí vaše hodnoty?</h4>
            </CalculatorCardTitle>
            <CalculatorCardDescription>
              <p className="text-slate-500">Hodnotové otázky místo konkrétních návrhů. Zjistěte, které strany zastávají podobné hodnoty jako vy.</p>
            </CalculatorCardDescription>
            <CalculatorCardCTA>
              <Link href="/volby/snemovni-2025/kompas" className="grid">
                <Button variant="outline" color="neutral">
                  Spustit kalkulačku
                </Button>
              </Link>
            </CalculatorCardCTA>
          </CalculatorCard>
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
