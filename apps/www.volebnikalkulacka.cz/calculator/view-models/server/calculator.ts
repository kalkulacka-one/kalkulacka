import type { Calculator } from "../../../../../packages/schema/schemas/calculator.schema";

export type CalculatorViewModel = Calculator;

export function calculatorViewModel(calculator: Calculator): CalculatorViewModel {
  return calculator;
}
