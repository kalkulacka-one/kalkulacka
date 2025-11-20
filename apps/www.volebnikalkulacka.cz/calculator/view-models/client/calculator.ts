import { useMemo } from "react";

import { useCalculatorStore } from "@/calculator/stores";
import { type CalculatorViewModel, calculatorViewModel } from "@/calculator/view-models/server";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
