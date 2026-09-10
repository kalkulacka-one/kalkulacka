import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";

export const metadata = {
  title: "Sněmovní volby 2025",
};

export default function Page() {
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
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <span aria-hidden>←</span> Zpět na hlavní stránku
        </Link>

        {/* Heading */}
        <h1 className="mt-4 font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Sněmovní volby 2025</h1>
        <p className="mt-4 max-w-prose text-slate-500">Volby do Poslanecké sněmovny proběhly 3. a 4. října 2025. Všechny kalkulačky si můžete vyplnit i po volbách.</p>

        {/* Featured cards */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {/* Left featured */}
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Nejoblíbenější kalkulačka</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">42 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 minut</span>
              </div>
              <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kdo zastává vaše postoje?</h2>
              <p className="mt-2 text-slate-500">Klasická Volební kalkulačka, jak ji znáte už skoro 20 let.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/kalkulacka" className="grid">
                  <Button variant="fill" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Right featured */}
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Inventura hlasování</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">35 hlasování</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 minut</span>
              </div>
              <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kdo vás zastupoval ve Sněmovně?</h2>
              <p className="mt-2 text-slate-500">Žádné sliby, ale skutečná hlasování poslanců ve Sněmovně za končící volební období.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/inventura" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit inventuru hlasování
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Other calculators */}
        <h2 className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Další volební kalkulačky</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="h-full !border-slate-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700">Expresní kalkulačka</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">25 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">5 minut</span>
              </div>
              <h3 className="mt-3 font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Nejužitečnějších 5 minut před volbami</h3>
              <p className="mt-1 text-slate-500">Těch 25 nejklíčovějších otázek, které vám zaberou jen 5 minut.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/expresni" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card shadow="hard" border corner="topLeft" className="h-full !border-slate-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">Ultimátní kalkulačka</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">100 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">30 minut</span>
              </div>
              <h3 className="mt-3 font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Všech 100 otázek pro „politické fajnšmekry"</h3>
              <p className="mt-1 text-slate-500">Nejrozsáhlejší verze se všemi 100 otázkami, na které jsme se ptali.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/ultimatni" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Thematic calculators */}
        <h2 className="mt-12 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Tématické volební kalkulačky</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="h-full !border-slate-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full px-2.5 py-1 font-semibold" style={{ backgroundColor: "rgb(156, 196, 232)", color: "rgb(40, 38, 92)" }}>
                  Pro mladé
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">35 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 minut</span>
              </div>
              <h3 className="mt-3 font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">35 otázek, které pálí nejen mladou generaci</h3>
              <p className="mt-1 text-slate-500">
                Témata, která podle výzkumu pálí mladou generaci. Ve spolupráci s{" "}
                <a href="https://dikyzemuzem.cz" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
                  Díky, že můžem
                </a>
                .
              </p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/pro-mlade" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          <Card shadow="hard" border corner="topLeft" className="h-full !border-slate-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full px-2.5 py-1 font-semibold bg-green-100 text-green-600">Klimatická</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">20 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">5 minut</span>
              </div>
              <h3 className="mt-3 font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Kdo má plán pro klima?</h3>
              <p className="mt-1 text-slate-500">
                Výběr otázek ke klimatické změně: povolenky, energetika, doprava. Ve spolupráci s{" "}
                <a href="https://faktaoklimatu.cz" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900 underline underline-offset-2">
                  Fakty o klimatu
                </a>
                .
              </p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/klimaticka" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          <Card shadow="hard" border corner="topLeft" className="h-full !border-slate-200">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full px-2.5 py-1 font-semibold bg-purple-100 text-purple-700">Volební kompas</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">25 otázek</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 minut</span>
              </div>
              <h3 className="mt-3 font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl">Kdo sdílí vaše hodnoty?</h3>
              <p className="mt-1 text-slate-500">Hodnotové otázky místo konkrétních návrhů. Zjistěte, které strany zastávají podobné hodnoty jako vy.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025/kompas" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustit kalkulačku
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
