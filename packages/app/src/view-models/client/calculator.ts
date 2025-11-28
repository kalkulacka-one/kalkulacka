import { useMemo } from "react";

import { useCalculatorStore } from "@/stores";
import { type CalculatorViewModel, calculatorViewModel } from "@/view-models/server/calculator";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
