import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";

import { SubscribeForm } from "@/components/client";

export default function Page() {
  return (
    <div className="relative bg-slate-50 z-0">
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
        {/* Campaign: komunálne + župné voľby 2026 */}
        <h1 className="font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Komunálne a župné voľby 2026</h1>
        <div className="mt-10 md:mt-12 grid grid-cols-1 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="bg-white !border-slate-200">
            <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Pripravujeme</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">24.&nbsp;októbra&nbsp;2026</span>
                </div>
                <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Nech vám nové kalkulačky neujdú</h2>
                <p className="text-slate-500">Nechajte nám na seba e-mail a dáme vám vedieť, hneď ako volebné kalkulačky pre komunálne a župné voľby spustíme.</p>
              </div>
              <div className="w-full">
                <SubscribeForm />
              </div>
            </div>
          </Card>
        </div>

        {/* Other calculators */}
        <h2 className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">Ďalšie kalkulačky</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Inventúra hlasovania</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">10 minút</span>
              </div>
              <h3 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Kto vás naozaj zastupuje?</h3>
              <p className="mt-2 text-slate-500">Žiadne sľuby, ale skutočné hlasovania 2023-2025.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <Link href="/inventura-2023-2025" className="grid">
                  <Button variant="outline" color="neutral">
                    Spustiť inventúru hlasovania
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card border className="h-full !border-slate-200 bg-slate-50/50">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">Staršie voľby</span>
              </div>
              <h3 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Archív kalkulačiek</h3>
              <p className="mt-2 text-slate-500">Volebné kalkulačky k starším voľbám nájdete v archíve.</p>
              <div className="grid mt-auto pt-4 md:pt-6">
                <a href="https://archiv.volebnakalkulacka.sk" target="_blank" rel="noopener noreferrer" className="grid">
                  <Button variant="link" color="neutral">
                    Prejsť do archívu
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
