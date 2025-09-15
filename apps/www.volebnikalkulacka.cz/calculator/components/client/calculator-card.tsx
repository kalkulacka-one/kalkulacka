import { Card } from "@repo/design-system/server";

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

type CalculatorCardCTA = {
  children: React.ReactNode;
};

function CalculatorCardHeader({ children }: CalculatorCardHeader) {
  return <div className="flex gap-2">{children}</div>;
}

function CalculatorCardTitle({ children }: CalculatorCardTitle) {
  return <div className="justify-self-start max-w-sm text-left">{children}</div>;
}

function CalculatorCardDescription({ children }: CalculatorCardDescription) {
  return <div className="justify-self-start text-left">{children}</div>;
}

function CalculatorCardCTA({ children }: CalculatorCardCTA) {
  return <div className="grid items-stretch">{children}</div>;
}

export function CalculatorCard({ children }: CalculatorCard) {
  return (
    <Card shadow="hard" corner="topLeft">
      <div className="grid gap-4 px-8 py-7 h-full items-start">{children}</div>
    </Card>
  );
}

CalculatorCard.Header = CalculatorCardHeader;
CalculatorCard.Title = CalculatorCardTitle;
CalculatorCard.Description = CalculatorCardDescription;
CalculatorCard.Cta = CalculatorCardCTA;

export { CalculatorCardHeader, CalculatorCardTitle, CalculatorCardDescription, CalculatorCardCTA };
