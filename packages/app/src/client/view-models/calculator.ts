import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type CalculatorViewModel, calculatorViewModel } from "@/view-models/calculator";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
