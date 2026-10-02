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
        const surface = card.available ? "koa:bg-surface" : "koa:bg-surface-sunken/70";
        const titleColor = card.available ? "koa:text-text-strong" : "koa:text-text-muted";
        const action = ButtonVariants({ color: "neutral", variant: index === 0 ? "fill" : "outline" });

        return (
          <div key={card.key} className={`koa:rounded-[1.25rem] koa:border koa:border-border koa:shadow-surface ${surface}`}>
            <div className="koa:grid koa:gap-3 koa:p-5 koa:sm:p-6">
              <h3 className={`koa:font-display koa:text-xl koa:font-bold koa:tracking-tight ${titleColor}`}>{card.title}</h3>
              {card.description && <p className="koa:leading-relaxed koa:text-text-muted">{card.description}</p>}
              {card.href ? (
                <a href={card.href} className={`koa:text-center ${action}`}>
                  {startLabel}
                </a>
              ) : (
                <p className="koa:font-semibold koa:text-text-muted">{unavailableLabel}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
