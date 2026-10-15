import { loadCalculator, NotFoundError } from "@kalkulacka-one/app";
import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";

import { SubscribeForm } from "@/components/client";

const CITY_INVENTORIES = [
  { key: "bratislava-inventura", label: "Bratislava" },
  { key: "kosice-inventura", label: "Košice" },
];

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

async function isAvailable(key: string): Promise<boolean> {
  try {
    await loadCalculator({ endpoint: endpoint(), key });
    return true;
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      console.error(`Calculator \`${key}\` could not be loaded`, error);
    }
    return false;
  }
}

export async function Campaign() {
  const available = await Promise.all(CITY_INVENTORIES.map(async (city) => ((await isAvailable(city.key)) ? [city] : [])));
  const cities = available.flat();

  return (
    <>
      {cities.length > 0 && (
        <Card shadow="hard" border corner="topLeft" className="bg-white !border-slate-200 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Inventúra hlasovania</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">24.&nbsp;októbra&nbsp;2026</span>
          </div>
          <h2 className="mt-4 font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Ako hlasovali vaši poslanci?</h2>
          <p className="mt-2 text-slate-500 leading-relaxed">Porovnajte svoje názory so skutočnými hlasovaniami mestského zastupiteľstva vo volebnom období 2022–2026.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {cities.map(({ key, label }) => (
              <Link key={key} href={`/${key}`} className="grid">
                <Button>{label}</Button>
              </Link>
            ))}
          </div>
        </Card>
      )}
      <Card border className={`${cities.length > 0 ? "mt-8 !border-slate-200 bg-slate-50/50" : "bg-white !border-slate-200"}`} shadow={cities.length > 0 ? undefined : "hard"} corner="topLeft">
        <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-start gap-3">
            {cities.length === 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Pripravujeme</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">24.&nbsp;októbra&nbsp;2026</span>
              </div>
            )}
            <h2 className="font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Nech vám nové kalkulačky neujdú</h2>
            <p className="text-slate-500">
              {cities.length > 0
                ? "Nechajte nám na seba e-mail a dáme vám vedieť, keď spustíme ďalšie kalkulačky."
                : "Nechajte nám na seba e-mail a dáme vám vedieť, hneď ako volebné kalkulačky pre komunálne a župné voľby spustíme."}
            </p>
          </div>
          <div className="w-full">
            <SubscribeForm />
          </div>
        </div>
      </Card>
    </>
  );
}
