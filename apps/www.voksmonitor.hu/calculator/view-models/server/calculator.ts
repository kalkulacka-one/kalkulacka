import type { Calculator } from "../../../../../packages/schema/schemas/calculator.schema";

export type CalculatorViewModel = Calculator & {
  readonly key: string | undefined;
  readonly title: string;
  readonly secondaryTitle: string | undefined;
};

export function calculatorViewModel(calculator: Calculator): CalculatorViewModel {
  const calculatorGroupShortTitle = "Voksmonitor 2026";
  const title = calculator?.shortTitle || calculatorGroupShortTitle;
  const secondaryTitle = calculator?.shortTitle ? calculatorGroupShortTitle : undefined;

  if ("key" in calculator) {
    return {
      ...calculator,
      key: calculator.key,
      title,
      secondaryTitle,
    };
  }

  return {
    ...calculator,
    key: undefined,
    title,
    secondaryTitle,
  };
}
