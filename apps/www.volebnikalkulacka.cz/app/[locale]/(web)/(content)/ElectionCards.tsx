import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Link from "next/link";

export type ElectionCard = {
  /** The calculator group key — also the React key. */
  key: string;
  /** The election's name, e.g. "Komunální volby 2026". */
  name: string;
  /** What the voter picks on the page behind the card, e.g. "73 měst". */
  scope: string;
  heading: string;
  description: string;
  callToAction: string;
  href: string;
};

/**
 * The elections a voter can start from the homepage.
 *
 * Kept apart from the page because the homepage is due a redesign: this is the
 * part that has to survive it, and it should move as one piece.
 */
export function ElectionCards({ elections }: { elections: ElectionCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-stretch">
      {elections.map((election) => (
        <Card key={election.key} shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
          <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">{election.name}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{election.scope}</span>
            </div>
            <h3 className="mt-4 font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">{election.heading}</h3>
            <p className="mt-2 text-slate-500">{election.description}</p>
            <div className="grid mt-auto pt-4 md:pt-6">
              <Link href={election.href} className="grid">
                <Button variant="fill" color="neutral">
                  {election.callToAction}
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
