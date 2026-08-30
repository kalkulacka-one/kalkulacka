// TODO [TENANT-004]: Implement SK donation card with Slovak donation platform and EUR currency

import { Button, Icon, Logo } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiClose } from "@mdi/js";
import { useState } from "react";

import { plausibleEvent } from "@/lib/analytics";

export function DonateCard() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>("9");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const plausibleClassNames = plausibleEvent("Donate", { source: "result-card", amount: selectedAmount ?? "custom", currency: "EUR" });

  const getDarujmeUrl = (amount?: string) => {
    if (amount) {
      return `https://www.darujme.cz/darovat/1202684?currency=EUR&frequency=once&amount=${amount}`;
    }
    return "https://www.darujme.cz/darovat/1202684";
  };

  return (
    <div className="sm:mx-4 lg:mx-8">
      <Card corner="bottomRight" className="@container p-3 sm:p-4 !bg-slate-100 border border-slate-200">
        <div className="grid gap-2 grid-cols-3 @sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="col-span-2 @sm:col-span-1 @sm:row-start-5 @sm:col-start-1 @sm:self-center">
            <Logo title="Volebná kalkulačka" size="small" />
          </div>
          <div className="row-span-2 justify-self-end self-start @sm:col-start-4 @sm:row-span-2">
            <Button variant="link" color="neutral" size="small" onClick={() => setIsVisible(false)} aria-label="Zavrieť">
              <Icon icon={mdiClose} size="small" decorative />
            </Button>
          </div>
          <div className="col-span-2 @sm:col-span-3">
            <h3 className="text-lg font-display font-bold text-slate-700 tracking-tight">
              Pomohla vám <span className="whitespace-nowrap">Volebná kalkulačka?</span>
            </h3>
          </div>
          <div className="col-span-3 @sm:col-span-3">
            <p className="text-neutral text-sm leading-relaxed text-slate-600">Volebná kalkulačka je nezávislá a nezisková. Podporte demokraciu a pomôžte miliónom voličov.</p>
          </div>
          <div className="@sm:col-start-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "9" ? null : "9");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "9" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              👍 9 EUR
            </button>
          </div>
          <div className="@sm:col-start-3">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "20" ? null : "20");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "20" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              ❤️ 20 EUR
            </button>
          </div>
          <div className="@sm:col-start-4">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "50" ? null : "50");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "50" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              🤩 50 EUR
            </button>
          </div>
          <div className="col-span-3 @sm:col-start-2 @sm:col-span-3">
            <a href={getDarujmeUrl(selectedAmount || undefined)} target="_blank" className={`grid ${plausibleClassNames}`}>
              <Button variant="outline" color="primary" size="medium">
                Podporiť Volebnú kalkulačku
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
