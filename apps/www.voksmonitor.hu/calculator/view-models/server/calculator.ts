import type { Calculator } from "../../../../../packages/schema/schemas/calculator.schema";

export type CalculatorViewModel = Calculator & {
  readonly title: string;
  readonly secondaryTitle: string | undefined;
};

export function calculatorViewModel(calculator: Calculator): CalculatorViewModel {
  const calculatorGroupShortTitle = "Voksmonitor 2025";
  const title = calculator?.shortTitle || calculatorGroupShortTitle;
  const secondaryTitle = calculator?.shortTitle ? calculatorGroupShortTitle : undefined;

  return {
    ...calculator,
    title,
    secondaryTitle,
  };
}
