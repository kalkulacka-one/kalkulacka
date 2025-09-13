import { Button, Logo } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import { useState } from "react";

export function DonateCard() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>("200");

  const getDarujmeUrl = (amount?: string) => {
    if (amount) {
      return `https://www.darujme.cz/darovat/1200653?frequency=once&amount=${amount}`;
    }
    return "https://www.darujme.cz/darovat/1200653";
  };

  return (
    <div className="sm:mx-4 lg:mx-8">
      <Card corner="bottomRight" className="@container p-3 sm:p-4 !bg-slate-500/10 border border-slate-300">
        <div className="grid gap-2 grid-cols-[1fr_1fr_1fr] @sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="col-span-2 @sm:col-span-4">
            <h3 className="text-lg font-display font-bold">
              Pomohla vám <span className="whitespace-nowrap">Volební kalkulačka?</span>
            </h3>
          </div>
          <div className="col-span-1 @sm:col-span-1 flex items-start @sm:items-center justify-end @sm:justify-start @sm:row-start-4">
            <Logo title="Volební kalkulačka" size="small" />
          </div>
          <div className="col-span-3 @sm:col-span-4">
            <p className="text-neutral text-sm leading-relaxed">Volební kalkulačka je nezávislá a nezisková. Podpořte demokracii a pomozte milionům voličů.</p>
          </div>
          <div className="col-span-1 @sm:col-start-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "100" ? null : "100");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "100" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              👍 100 Kč
            </button>
          </div>
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "200" ? null : "200");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "200" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              ❤️ 200 Kč
            </button>
          </div>
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "500" ? null : "500");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "500" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              🤩 500 Kč
            </button>
          </div>
          <div className="col-span-3 @sm:col-span-3 grid">
            <a href={getDarujmeUrl(selectedAmount || undefined)} target="_blank" className="grid">
              <Button variant="outline" color="primary" size="medium">
                Podpořit Volební kalkulačku
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
