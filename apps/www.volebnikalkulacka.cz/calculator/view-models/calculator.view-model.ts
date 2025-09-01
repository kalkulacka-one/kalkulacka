import type { Calculator } from "../../../../packages/schema/schemas/calculator.schema";
import { useCalculatorStore } from "../stores/calculatorStore";

export type CalculatorViewModel = Calculator | undefined;

export function useCalculatorViewModel(): CalculatorViewModel {
  const calculator = useCalculatorStore((state) => state.calculator?.calculator);
  return calculator;
}
