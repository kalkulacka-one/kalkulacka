import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";

import { CitySignupForm } from "@/components/client";

export const metadata = {
  title: "Pomozte nám s kalkulačkou pro vaše město",
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
        <h1 className="mt-4 font-display ko:font-display font-bold tracking-tighter text-slate-700 text-4xl md:text-5xl lg:text-6xl">Pomozte nám s kalkulačkou pro vaše město</h1>
        <p className="mt-4 max-w-prose text-slate-500">
          Ke komunálním volbám 2026 připravujeme volební kalkulačky pro vybraná města. Chcete, aby vznikla i pro to vaše? Vyberte město, nechte nám na sebe e-mail a ozveme se vám.
        </p>

        {/* Signup card */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 items-stretch">
          <Card shadow="hard" border corner="topLeft" className="bg-white !border-slate-200">
            <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2 md:items-center">
              <div className="flex flex-col items-start gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Komunální volby 2026</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">9.&nbsp;a&nbsp;10.&nbsp;října&nbsp;2026</span>
                </div>
                <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Přidejte se!</h2>
                <p className="text-slate-500">
                  Kalkulačka pro vaše město vznikne jen s pomocí lidí, kteří tam žijí, vědí, co se ve městě řeší, a znají místní kandidáty — od těch totiž potřebujeme získat odpovědi na otázky. Dáme
                  vám vědět, jak se můžete zapojit.
                </p>
              </div>
              <div className="w-full">
                <CitySignupForm />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
