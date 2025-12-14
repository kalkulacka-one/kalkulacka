import { type CalculatorViewModel, calculatorViewModel } from "@kalkulacka-one/app";

import { useMemo } from "react";

import { useCalculatorStore } from "@kalkulacka-one/app/client";

export function useCalculator(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.data.calculator);
  return useMemo(() => calculatorViewModel(calculator), [calculator]);
}
