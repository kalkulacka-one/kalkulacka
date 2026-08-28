import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";
import { useId } from "react";

import { SubscribeForm } from "@/components/client";

import { BeadRow } from "./BeadRow";

export default function Page() {
  const bgGridId = useId();

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
        {/* Campaign: komunální + senátní volby 2026 */}
        <h1 className="font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Komunální a senátní volby 2026</h1>
        <div className="mt-10 md:mt-12 grid grid-cols-1 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="bg-white !border-slate-200">
            <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Připravujeme</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">9.&nbsp;a&nbsp;10.&nbsp;října&nbsp;2026</span>
                </div>
                <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Ať vám nové kalkulačky neutečou</h2>
                <p className="text-slate-500">Nechte nám na sebe e-mail a dáme vám vědět, jakmile volební kalkulačky pro komunální a senátní volby spustíme.</p>
              </div>
              <div className="w-full">
                <SubscribeForm />
              </div>
            </div>
          </Card>

          <Card border className="mt-8 !border-slate-200 bg-slate-50/50">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-1">
                <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-xl md:text-2xl">Pomozte nám s kalkulačkou pro vaše město</h2>
                <p className="mt-1 text-slate-500">Kalkulačky ke komunálním volbám vznikají s pomocí lidí přímo z místa.</p>
              </div>
              <Link href="/zapojte-se" className="grid md:shrink-0">
                <Button variant="outline" color="neutral">
                  Přidejte se
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Sněmovní volby 2025 */}
        <h2 className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Další kalkulačky</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">Sněmovní volby 2025</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">7 kalkulaček</span>
              </div>
              <h3 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kalkulačky ke sněmovním volbám</h3>
              <p className="mt-2 text-slate-500">Všech sedm kalkulaček ke sněmovním volbám 2025 si můžete vyplnit i po volbách — od expresní po ultimátní.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/volby/snemovni-2025" className="grid">
                  <Button variant="outline" color="neutral">
                    Prohlédnout kalkulačky
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card border className="h-full !border-slate-200 bg-slate-50/50">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">Starší volby</span>
              </div>
              <h3 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Archiv kalkulaček</h3>
              <p className="mt-2 text-slate-500">Volební kalkulačky ke starším volbám najdete v archivu.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
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
        <div className="mt-16 border-t border-slate-200 pt-6 text-center text-slate-500">© 2026 Volební kalkulačka</div>
      </div>
    </div>
  );
}
