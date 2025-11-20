import { mdiClose } from "@mdi/js";
import { Button, Icon, Logo } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import { useState } from "react";

export function DonateCard() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>("200");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getDarujmeUrl = (amount?: string) => {
    if (amount) {
      return `https://www.darujme.cz/darovat/1200653?frequency=once&amount=${amount}`;
    }
    return "https://www.darujme.cz/darovat/1200653";
  };

  return (
    <div className="sm:mx-4 lg:mx-8">
      <Card corner="bottomRight" className="@container p-3 sm:p-4 !bg-slate-100 border border-slate-200">
        <div className="grid gap-2 grid-cols-3 @sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="col-span-2 @sm:col-span-1 @sm:row-start-5 @sm:col-start-1 @sm:self-center">
            <Logo title="Volební kalkulačka" size="small" />
          </div>
          <div className="row-span-2 justify-self-end self-start @sm:col-start-4 @sm:row-span-2">
            <Button variant="link" color="neutral" size="small" onClick={() => setIsVisible(false)} aria-label="Zavřít">
              <Icon icon={mdiClose} size="small" decorative />
            </Button>
          </div>
          <div className="col-span-2 @sm:col-span-3">
            <h3 className="text-lg font-display font-bold text-slate-700 tracking-tight">
              Pomohla vám <span className="whitespace-nowrap">Volební kalkulačka?</span>
            </h3>
          </div>
          <div className="col-span-3 @sm:col-span-3">
            <p className="text-neutral text-sm leading-relaxed text-slate-600">Volební kalkulačka je nezávislá a nezisková. Podpořte demokracii a pomozte milionům voličů.</p>
          </div>
          <div className="@sm:col-start-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "200" ? null : "200");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "200" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              👍 200 Kč
            </button>
          </div>
          <div className="@sm:col-start-3">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "500" ? null : "500");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "500" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              ❤️ 500 Kč
            </button>
          </div>
          <div className="@sm:col-start-4">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "1000" ? null : "1000");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "1000" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50"
              }`}
            >
              🤩 1 000 Kč
            </button>
          </div>
          <div className="col-span-3 @sm:col-start-2 @sm:col-span-3">
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
