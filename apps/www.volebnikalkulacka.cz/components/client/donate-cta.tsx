import { Button } from "@kalkulacka-one/design-system/client";

import { useState } from "react";

import { plausibleEvent } from "@/lib/analytics";

const donateUrl = "https://www.darujme.cz/darovat/1200653";

const amounts = [
  { value: "200", label: "👍 200 Kč" },
  { value: "500", label: "❤️ 500 Kč" },
  { value: "1000", label: "🤩 1 000 Kč" },
] as const;

export type DonateCta = {
  // Distinguishes the surface the donation came from in Plausible
  source: string;
  heading?: string;
  description?: string;
};

export function DonateCta({ source, heading = "Pomozte nám kalkulačky připravit", description }: DonateCta) {
  const [selectedAmount, setSelectedAmount] = useState<string | null>("500");

  const getDarujmeUrl = (amount: string | null) => (amount ? `${donateUrl}?frequency=once&amount=${amount}` : donateUrl);

  const plausibleClassNames = plausibleEvent("Donate", { source, amount: selectedAmount ?? "custom", currency: "CZK" });

  return (
    <div className="grid gap-3 rounded-2xl rounded-br-none border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-1">
        <h3 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-lg">{heading}</h3>
        <p className="text-sm text-slate-500">{description ?? "Kalkulačky ke komunálním volbám připravujeme s lidmi přímo z měst a obcí. Váš příspěvek platí jejich přípravu i provoz webu."}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {amounts.map((amount) => (
          <button
            key={amount.value}
            type="button"
            onClick={() => setSelectedAmount(selectedAmount === amount.value ? null : amount.value)}
            aria-pressed={selectedAmount === amount.value}
            className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer ${
              selectedAmount === amount.value ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
            }`}
          >
            {amount.label}
          </button>
        ))}
      </div>
      <a href={getDarujmeUrl(selectedAmount)} target="_blank" rel="noopener noreferrer" className={`grid ${plausibleClassNames}`}>
        <Button variant="outline" color="primary" size="medium">
          Podpořit Volební kalkulačku
        </Button>
      </a>
    </div>
  );
}
