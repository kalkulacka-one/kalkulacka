import { useCalculatorStore } from "../stores";
import type { CandidateViewModel } from "./candidate";

export function useCandidatesViewModel(): CandidateViewModel[] {
  const candidates = useCalculatorStore((state) => state.calculator.candidates);
  return candidates;
}
