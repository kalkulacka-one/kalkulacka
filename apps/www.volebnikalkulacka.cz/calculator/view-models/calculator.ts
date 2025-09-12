import { useMemo } from "react";

import type { Calculator } from "../../../../packages/schema/schemas/calculator.schema";
import { useCalculatorStore } from "../stores";

export type CalculatorViewModel = Calculator;

export function calculatorViewModel(calculator: Calculator): CalculatorViewModel {
  return calculator;
}

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((s) => s.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
