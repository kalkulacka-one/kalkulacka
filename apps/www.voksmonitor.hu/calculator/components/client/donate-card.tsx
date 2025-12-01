import { mdiClose } from "@mdi/js";
import { Button, Icon, Logo } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import { useState } from "react";

export function DonateCard() {
  const [selectedAmount, setSelectedAmount] = useState<string | null>("1000");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getPayPalUrl = (amount?: string) => {
    const baseUrl = "https://www.paypal.me/kmonitor";
    if (amount) {
      return `${baseUrl}/${amount}HUF`;
    }
    return baseUrl;
  };

  return (
    <div className="sm:mx-4 lg:mx-8">
      <Card corner="bottomRight" className="@container p-3 sm:p-4 !bg-slate-100 border border-slate-200">
        <div className="grid gap-2 grid-cols-3 @sm:grid-cols-[1fr_auto_auto_auto]">
          <div className="col-span-2 @sm:col-span-1 @sm:row-start-5 @sm:col-start-1 @sm:self-center">
            <Logo title="Voksmonitor" size="small" />
          </div>
          <div className="row-span-2 justify-self-end self-start @sm:col-start-4 @sm:row-span-2">
            <Button variant="link" color="neutral" size="small" onClick={() => setIsVisible(false)} aria-label="Zavřít">
              <Icon icon={mdiClose} size="small" decorative />
            </Button>
          </div>
          <div className="col-span-2 @sm:col-span-3">
            <h3 className="text-lg font-display font-bold text-slate-700 tracking-tight">Voksmonitor támogatása</h3>
          </div>
          <div className="col-span-3 @sm:col-span-3">
            <p className="text-neutral text-sm leading-relaxed text-slate-600">Támogasd a Voksmonitort készítő K-Monitor egyesületet!</p>
          </div>
          <div className="@sm:col-start-2">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "1000" ? null : "1000");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "1000" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-gray-50"
              }`}
            >
              👍 1 000 Ft
            </button>
          </div>
          <div className="@sm:col-start-3">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "5000" ? null : "5000");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "5000" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-gray-50"
              }`}
            >
              ❤️ 5 000 Ft
            </button>
          </div>
          <div className="@sm:col-start-4">
            <button
              type="button"
              onClick={() => {
                setSelectedAmount(selectedAmount === "10000" ? null : "10000");
              }}
              className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full @sm:w-auto ${
                selectedAmount === "10000" ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-gray-50"
              }`}
            >
              🤩 10 000 Ft
            </button>
          </div>
          <div className="col-span-3 @sm:col-start-2 @sm:col-span-3">
            <a href={getPayPalUrl(selectedAmount || undefined)} target="_blank" className="grid">
              <Button variant="outline" color="primary" size="medium">
                Támogatom a Voksmonitort
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
