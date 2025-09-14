import { mdiClose } from "@mdi/js";
import { Button, Icon, Logo } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import { useState } from "react";

export function DonateCard() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="sm:mx-4 lg:mx-8">
      <Card corner="bottomRight" className="@container p-3 sm:p-4 !bg-slate-500/10 border border-slate-300">
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
            <h3 className="text-lg font-display font-bold">
              Pomohla vám <span className="whitespace-nowrap">Volební kalkulačka?</span>
            </h3>
          </div>
          <div className="col-span-3 @sm:col-span-3">
            <p className="text-neutral text-sm leading-relaxed">Volební kalkulačka je nezávislá a nezisková. Podpořte demokracii a pomozte milionům voličů.</p>
          </div>
          <div className="@sm:col-start-2">
            <a
              href="https://www.darujme.cz/darovat/1200653?frequency=once&amount=100"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border border-neutral-300 bg-white text-neutral hover:bg-neutral-50 transition-all cursor-pointer w-full @sm:w-auto"
            >
              👍 100 Kč
            </a>
          </div>
          <div className="@sm:col-start-3">
            <a
              href="https://www.darujme.cz/darovat/1200653?frequency=once&amount=200"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border border-slate-500 bg-slate-200 text-slate-700 transition-all cursor-pointer w-full @sm:w-auto"
            >
              ❤️ 200 Kč
            </a>
          </div>
          <div className="@sm:col-start-4">
            <a
              href="https://www.darujme.cz/darovat/1200653?frequency=once&amount=500"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border border-neutral-300 bg-white text-neutral hover:bg-neutral-50 transition-all cursor-pointer w-full @sm:w-auto"
            >
              🤩 500 Kč
            </a>
          </div>
          <div className="col-span-3 @sm:col-start-2 @sm:col-span-3">
            <a href="https://www.darujme.cz/projekt/1200653" target="_blank" rel="noopener noreferrer" className="grid">
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
