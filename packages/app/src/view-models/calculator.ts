import type { Calculator } from "@kalkulacka-one/schema";

export type CalculatorViewModel = Calculator & {
  readonly title: string;
  readonly secondaryTitle: string | undefined;
};

export function calculatorViewModel(calculator: Calculator): CalculatorViewModel {
  const title = calculator?.title || calculator?.shortTitle || "";
  const secondaryTitle = undefined;

  return {
    ...calculator,
    title,
    secondaryTitle,
  };
}
