import { Badge, Card } from "@kalkulacka-one/design-system/server";

import type { Badge as BadgeType, CalculatorViewModel } from "@/calculator/view-models/server";

export type CalculatorCard = {
  calculator: CalculatorViewModel;
  children?: React.ReactNode;
};

export function CalculatorCard({ calculator, children }: CalculatorCard) {
  const { title, badges, featured, description } = calculator.card || {};

  return (
    <Card shadow="hard" corner="topLeft">
      <div className="flex flex-col gap-4 px-8 py-7 h-full items-start">
        {/* Header with badges */}
        {badges && (
          <div className="flex gap-2 flex-wrap">
            <div className="flex flex-wrap items-center gap-2">
              {badges.map((badge: BadgeType) => (
                <Badge key={badge.text} color={badge.color}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Title */}
        <div className="justify-self-start text-left">
          <h2 className={`font-display ko:font-display font-bold tracking-tight text-slate-700 ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>{title}</h2>
        </div>

        {/* Paragraph */}
        <p>{description}</p>

        {/* CTA */}
        {children && <div className="grid mt-auto w-full">{children}</div>}
      </div>
    </Card>
  );
}
