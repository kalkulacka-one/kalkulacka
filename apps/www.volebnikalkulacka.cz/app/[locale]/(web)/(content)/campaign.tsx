import { type ElectionSummaryViewModel, electionSummaryViewModel, ifFound, loadCalculatorGroup, loadElection } from "@kalkulacka-one/app";
import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import { now } from "@kalkulacka-one/next";

import Link from "next/link";

import { SubscribeForm } from "@/components/client";
import { CALCULATOR_GROUPS, publishedCalculator } from "@/lib/site/calculators";

const DIRECT_LINKS_UP_TO = 4;

type CalculatorLink = { href: string; label: string };

type ElectionCard = {
  summary: ElectionSummaryViewModel;
  published: CalculatorLink[];
  pickerLabel: string;
};

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

async function electionCard(groupKey: string, current: Date): Promise<ElectionCard | undefined> {
  const [group, election] = await Promise.all([ifFound(loadCalculatorGroup({ endpoint: endpoint(), group: groupKey })), ifFound(loadElection({ endpoint: endpoint(), group: groupKey }))]);
  if (!group?.election || !election) return undefined;
  const calculators = await Promise.all(group.calculators.map(async (item) => ({ item, calculator: await publishedCalculator({ endpoint: endpoint(), group: groupKey, key: item.key, current }) })));
  const published = calculators.flatMap(({ item, calculator }) =>
    calculator ? [{ href: `/volby/${groupKey}/${item.district?.key ?? item.key}`, label: calculator.shortTitle ?? calculator.title ?? item.key }] : [],
  );
  if (published.length === 0) return undefined;
  const code = new Map((election.districts ?? []).map((district) => [`/volby/${groupKey}/${district.key}`, district.code ?? ""]));
  published.sort((a, b) => (code.get(a.href) ?? "").localeCompare(code.get(b.href) ?? ""));
  return { summary: electionSummaryViewModel(group, election), published, pickerLabel: group.selection?.title ?? "Vyberte kalkulačku" };
}

const day = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", timeZone: "Europe/Prague" });
const dayMonthYear = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Prague" });

function formatVotingDays(summary: ElectionSummaryViewModel): string | undefined {
  const first = summary.votingHours[0];
  const last = summary.votingHours[summary.votingHours.length - 1];
  if (!first || !last) return undefined;
  const start = new Date(first.start);
  const end = new Date(last.end);
  return day.format(start) === day.format(end) ? dayMonthYear.format(end) : `${day.format(start)} a ${dayMonthYear.format(end)}`;
}

export async function Campaign() {
  const current = now();
  const cards = (await Promise.all(CALCULATOR_GROUPS.map((group) => electionCard(group, current)))).flatMap((card) => (card ? [card] : []));
  const preparing = cards.some((card) => card.published.length <= DIRECT_LINKS_UP_TO);

  return (
    <>
      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:gap-y-0 md:grid-cols-2 md:grid-rows-[auto_auto_auto_auto_auto]">
          {cards.map(({ summary, published, pickerLabel }) => (
            <Card key={summary.groupKey} shadow="hard" border corner="topLeft" className="bg-white !border-slate-200 p-6 md:p-8 flex flex-col md:grid md:grid-rows-subgrid md:row-span-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                {formatVotingDays(summary) && <span className="rounded-full bg-slate-100 px-2.5 py-1">{formatVotingDays(summary)}</span>}
              </div>
              <h2 className="mt-4 font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{summary.title}</h2>
              <p className="mt-2 text-slate-500 leading-relaxed">{summary.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {published.length <= DIRECT_LINKS_UP_TO ? (
                  published.map(({ href, label }) => (
                    <Link key={href} href={href} className="grid">
                      <Button>{label}</Button>
                    </Link>
                  ))
                ) : (
                  <Link href={`/volby/${summary.groupKey}`} className="grid sm:col-span-2">
                    <Button>{pickerLabel}</Button>
                  </Link>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {published.length <= DIRECT_LINKS_UP_TO && "Kalkulačky pro komunální volby připravujeme. Zatím si můžete vyzkoušet inventuru hlasování zastupitelstev."}
              </p>
            </Card>
          ))}
        </div>
      )}
      <Card border className={`${cards.length > 0 ? "mt-8 !border-slate-200 bg-slate-50/50" : "bg-white !border-slate-200"}`} shadow={cards.length > 0 ? undefined : "hard"} corner="topLeft">
        <div className="p-6 md:p-8 grid gap-6 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-start gap-2">
            <h2 className="font-display font-bold tracking-tight text-slate-700 text-xl md:text-2xl">Ať vám nové kalkulačky neutečou</h2>
            <p className="text-slate-500">
              {preparing ? "Nechte nám e-mail a napíšeme vám, až spustíme kalkulačky pro komunální volby." : "Nechte nám e-mail a napíšeme vám, až spustíme další kalkulačky."}
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
