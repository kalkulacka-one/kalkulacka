import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type CalculatorViewModel, calculatorViewModel } from "../server/calculator";

export function useCalculatorViewModel(): CalculatorViewModel {
  const calculator = useCalculatorStore((s) => s.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
