import { Card } from "@repo/design-system/server";

import { Button } from "../../../../../packages/design-system/dist/components/client/button";

type CalculatorCard = {
  children: React.ReactNode;
};

type CalculatorCardHeader = {
  children: React.ReactNode;
};

type CalculatorCardTitle = {
  children: React.ReactNode;
};

type CalculatorCardDescription = {
  children: React.ReactNode;
};

function CalculatorCardHeader({ children }: CalculatorCardHeader) {
  return <div className="flex gap-2">{children}</div>;
}

function CalculatorCardTitle({ children }: CalculatorCardTitle) {
  return (
    <div className="justify-self-start max-w-sm">
      <h3 className="text-left text-slate-700 font-sans text-3xl font-semibold tracking-tighter leading-tight max-w-2xl break-words group-hover:text-primary transition-colors">{children}</h3>
    </div>
  );
}

function CalculatorCardDescription({ children }: CalculatorCardDescription) {
  return (
    <div className="justify-self-start">
      <p className=" text-left font-sans text-sm text-slate-600 leading-relaxed sm:text-base max-w-prose break-words">{children}</p>
    </div>
  );
}

export function CalculatorCard({ children }: CalculatorCard) {
  return (
    <Card shadow="hard" corner="topLeft">
      <div className="grid gap-4 px-8 py-7 h-full items-start">
        {children}
        <div className="grid items-stretch">
          <Button variant="fill" color="neutral">
            Spustit kalkulačku
          </Button>
        </div>
      </div>
    </Card>
  );
}

CalculatorCard.Header = CalculatorCardHeader;
CalculatorCard.Title = CalculatorCardTitle;
CalculatorCard.Description = CalculatorCardDescription;

export { CalculatorCardHeader, CalculatorCardTitle, CalculatorCardDescription };
