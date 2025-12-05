import { useMemo } from "react";

import { type CalculatorViewModel, calculatorViewModel } from "../../server";
import { useCalculatorStore } from "../../stores";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
