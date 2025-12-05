import { useMemo } from "react";

import { type CalculatorViewModel, calculatorViewModel } from "@/calculator";
import { useCalculatorStore } from "@/calculator/client";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
