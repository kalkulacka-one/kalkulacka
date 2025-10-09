import type { Calculator } from "../../../../../packages/schema/schemas/calculator.schema";

export type Badge = {
  text: string;
  color: "primary" | "secondary" | "neutral" | "yellow" | "green";
};

type Partnership = {
  text: string;
  partner: string;
  url: string;
};

type CalculatorCard =
  | {
      readonly title: string;
      readonly description?: string;
      readonly link?: string;
      readonly badges?: Badge[];
      readonly buttonText?: string;
      readonly buttonVariant?: "fill" | "outline" | "link";
      readonly featured?: boolean;
      readonly partnership?: Partnership;
    }
  | undefined;

export type CalculatorViewModel = Calculator & {
  readonly title: string;
  readonly secondaryTitle: string | undefined;
  readonly card: CalculatorCard;
};

export function calculatorViewModel(calculator: Calculator, card?: CalculatorCard): CalculatorViewModel {
  const calculatorGroupShortTitle = "Sněmovní 2025";
  const title = calculator?.shortTitle || calculatorGroupShortTitle;
  const secondaryTitle = calculator?.shortTitle ? calculatorGroupShortTitle : undefined;

  return {
    ...calculator,
    title,
    secondaryTitle,
    card,
  };
}
