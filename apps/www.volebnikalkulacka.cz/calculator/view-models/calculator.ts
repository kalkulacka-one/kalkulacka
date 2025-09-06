import type { Calculator } from "../../../../packages/schema/schemas/calculator.schema";
import { useCalculatorStore } from "../stores";

export type CalculatorViewModel = Calculator;

export function useCalculatorViewModel(): CalculatorViewModel {
  return useCalculatorStore((state) => state.calculator);
}
