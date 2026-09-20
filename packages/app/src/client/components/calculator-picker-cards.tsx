import { ButtonVariants } from "@kalkulacka-one/design-system/client";

import type { CalculatorPickerCardViewModel } from "@/view-models";

export type CalculatorPickerCards = {
  cards: CalculatorPickerCardViewModel[];
  startLabel: string;
  unavailableLabel: string;
};

// A client island: `ButtonVariants` comes from the design system's client entry, which a server shell cannot call.
export function CalculatorPickerCards({ cards, startLabel, unavailableLabel }: CalculatorPickerCards) {
  return (
    <div className="koa:grid koa:gap-4">
      {cards.map((card, index) => {
        const surface = card.available ? "koa:bg-white" : "koa:bg-slate-100/70";
        const titleColor = card.available ? "koa:text-slate-800" : "koa:text-slate-500";
        const action = ButtonVariants({ color: "neutral", variant: index === 0 ? "fill" : "outline" });

        return (
          <div key={card.key} className={`koa:rounded-[1.25rem] koa:border koa:border-slate-200 koa:shadow-[0_1px_2px_rgba(15,23,42,0.06)] ${surface}`}>
            <div className="koa:grid koa:gap-3 koa:p-5 koa:sm:p-6">
              <h3 className={`koa:font-display koa:text-xl koa:font-bold koa:tracking-tight ${titleColor}`}>{card.title}</h3>
              {card.description && <p className="koa:leading-relaxed koa:text-slate-500">{card.description}</p>}
              {card.href ? (
                <a href={card.href} className={`koa:text-center ${action}`}>
                  {startLabel}
                </a>
              ) : (
                <p className="koa:font-semibold koa:text-slate-500">{unavailableLabel}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
