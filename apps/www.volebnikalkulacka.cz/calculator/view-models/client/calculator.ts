import { type CalculatorViewModel, calculatorViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
