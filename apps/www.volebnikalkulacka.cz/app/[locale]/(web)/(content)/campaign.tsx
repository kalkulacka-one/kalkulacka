import { isPublished, loadCalculator, NotFoundError } from "@kalkulacka-one/app";
import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import { now } from "@kalkulacka-one/next";

import Link from "next/link";

import { SubscribeForm } from "@/components/client";

const GROUP = "komunalni-2026";
const CITIES = [
  { key: "praha-inventura", district: "praha" },
  { key: "brno-inventura", district: "brno" },
];

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

async function publishedCalculator(key: string, current: Date) {
  try {
    const calculator = await loadCalculator({ endpoint: endpoint(), key, group: GROUP });
    return isPublished(calculator, current) ? calculator : undefined;
  } catch (error) {
    if (!(error instanceof NotFoundError)) {
      console.error(`Calculator \`${GROUP}/${key}\` could not be loaded`, error);
    }
    return undefined;
  }
}

export async function Campaign() {
  const current = now();
  const cities = await Promise.all(CITIES.map(async ({ key, district }) => ({ district, calculator: await publishedCalculator(key, current) })));
  const live = cities.flatMap(({ district, calculator }) => (calculator ? [{ district, calculator }] : []));

  return (
    <>
      {live.length > 0 && <p className="mb-8 max-w-prose text-lg text-slate-500">Kalkulačky k říjnovým volbám chystáme. Než budou hotové, vyzkoušejte si inventuru hlasování zastupitelstev.</p>}
      <Card shadow="hard" border corner="topLeft" className="bg-white !border-slate-200">
        <div className="p-6 md:p-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Připravujeme</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">9.&nbsp;a&nbsp;10.&nbsp;října&nbsp;2026</span>
            </div>
            <h2 className="font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Ať vám nové kalkulačky neutečou</h2>
            <p className="text-slate-500">Nechte nám na sebe e-mail a dáme vám vědět, jakmile volební kalkulačky pro komunální a senátní volby spustíme.</p>
          </div>
          <div className="w-full">
            <SubscribeForm />
          </div>
        </div>
      </Card>
      {live.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
          {live.map(({ district, calculator }) => (
            <Card key={district} shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
              <div className="p-6 md:p-8 h-full flex flex-col">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">Nová kalkulačka</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">9.&nbsp;a&nbsp;10.&nbsp;října&nbsp;2026</span>
                </div>
                <h2 className="mt-4 font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{calculator.shortTitle ?? calculator.title}</h2>
                {calculator.description && <p className="mt-2 text-slate-500">{calculator.description}</p>}
                <div className="grid mt-auto pt-4 md:pt-6">
                  <Link href={`/volby/${GROUP}/${district}`} className="grid">
                    <Button>Spustit kalkulačku</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
