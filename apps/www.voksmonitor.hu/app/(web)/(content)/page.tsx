import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useId } from "react";

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

      {/* Test version disclaimer */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-50 py-2 text-center text-xs text-slate-500">
        <p>Ez egy tesztverzió. Hibák és pontatlanságok előfordulhatnak.</p>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
        {/* Heading */}
        <h1 className="font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Voksmonitor 2025</h1>

        {/* Featured cards */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {/* Right featured */}
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Szavazások leltára</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">35 szavazás</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 perc</span>
              </div>
              <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Budapesti közgyűlés voksmonitor</h2>
              <p className="mt-2 text-slate-500">Nem ígéretek, hanem valós képviselői szavazások a Parlamentben a lezáruló választási ciklusban.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/budapest-kozgyules/inventory" className="grid">
                  <Button variant="outline" color="neutral">
                    Szavazások leltárának indítása
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Archive section */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          <Card border className="h-full !border-slate-200 bg-slate-50/50">
            <div className="p-6 h-full flex flex-col">
              <p className="text-slate-600">A régebbi voksmonitorokat az archívumban találod</p>
              <div className="grid mt-auto pt-4">
                <a href="https://archiv-2024.volebnikalkulacka.cz" target="_blank" rel="noopener noreferrer" className="grid">
                  <Button variant="link" color="neutral">
                    Ugrás az archívumra
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-slate-200 pt-6 text-center text-slate-500">© 2025 Volební kalkulačka / Voksmonitor</div>
      </div>
    </div>
  );
}
