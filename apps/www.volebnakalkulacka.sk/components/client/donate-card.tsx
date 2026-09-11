import { Button, Icon, Logo } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import { plausibleEvent } from "@kalkulacka-one/next/analytics";

import { mdiClose } from "@mdi/js";
import { createContext, type ReactNode, useContext, useState } from "react";

const donateUrl = "https://www.darujme.cz/darovat/1202684";
const currency = "EUR";

const amounts = [
  { value: "9", label: "👍 9 EUR" },
  { value: "20", label: "❤️ 20 EUR" },
  { value: "50", label: "🤩 50 EUR" },
];

const DismissibleContext = createContext(false);

const amountColumnClassNames = ["@sm:col-start-2", "@sm:col-start-3", "@sm:col-start-4"];

export type DonateCard = {
  source: string;
  defaultAmount?: string;
  logo?: boolean;
  dismissible?: boolean;
  className?: string;
  children: ReactNode;
};

export function DonateCard({ source, defaultAmount = "9", logo = false, dismissible = false, className, children }: DonateCard) {
  const [selectedAmount, setSelectedAmount] = useState<string | null>(defaultAmount);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Without an amount Darujme lets the donor fill in their own
  const href = selectedAmount ? `${donateUrl}?currency=EUR&frequency=once&amount=${selectedAmount}` : donateUrl;
  const plausibleClassNames = plausibleEvent("Donate", { source, amount: selectedAmount ?? "custom", currency });

  return (
    <DismissibleContext.Provider value={dismissible}>
      <Card corner="bottomRight" className={["@container p-3 sm:p-4 !bg-slate-100 border border-slate-200", className].filter(Boolean).join(" ")}>
        <div className={`grid gap-2 grid-cols-3 ${logo ? "@sm:grid-cols-[1fr_auto_auto_auto]" : "@sm:grid-cols-3"}`}>
          {logo && (
            <div className="col-span-2 @sm:col-span-1 @sm:row-start-5 @sm:col-start-1 @sm:self-center">
              <Logo title="Volebná kalkulačka" size="small" />
            </div>
          )}
          {dismissible && (
            <div className={`row-span-2 justify-self-end self-start @sm:row-span-2 ${logo ? "@sm:col-start-4" : "@sm:col-start-3"}`}>
              <Button variant="link" color="neutral" size="small" onClick={() => setIsVisible(false)} aria-label="Zavrieť">
                <Icon icon={mdiClose} size="small" decorative />
              </Button>
            </div>
          )}
          {children}
          {amounts.map(({ value, label }, index) => (
            <div key={value} className={logo ? amountColumnClassNames[index] : undefined}>
              <button
                type="button"
                onClick={() => setSelectedAmount(selectedAmount === value ? null : value)}
                aria-pressed={selectedAmount === value}
                className={[
                  "inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded border transition-all cursor-pointer w-full",
                  logo ? "@sm:w-auto" : "",
                  selectedAmount === value ? "border-slate-500 bg-slate-200 text-slate-700" : "border-neutral-300 bg-white text-neutral hover:bg-neutral-50",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </button>
            </div>
          ))}
          <div className={`col-span-3 @sm:col-span-3 ${logo ? "@sm:col-start-2" : "@sm:col-start-1"}`}>
            <a href={href} target="_blank" className={`grid ${plausibleClassNames}`}>
              <Button variant="outline" color="primary" size="medium">
                Podporiť Volebnú kalkulačku
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </DismissibleContext.Provider>
  );
}

export type DonateCardHeading = {
  children: ReactNode;
};

export function DonateCardHeading({ children }: DonateCardHeading) {
  const dismissible = useContext(DismissibleContext);

  return (
    <div className={`${dismissible ? "col-span-2" : "col-span-3"} @sm:col-span-3`}>
      <h3 className="text-lg font-display font-bold text-slate-700 tracking-tight">{children}</h3>
    </div>
  );
}

export type DonateCardDescription = {
  children: ReactNode;
};

export function DonateCardDescription({ children }: DonateCardDescription) {
  return (
    <div className="col-span-3 @sm:col-span-3">
      <p className="text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

DonateCard.Heading = DonateCardHeading;
DonateCard.Description = DonateCardDescription;
