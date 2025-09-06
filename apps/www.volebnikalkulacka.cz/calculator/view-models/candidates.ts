import { useCalculatorStore } from "../stores";
import type { CandidateViewModel } from "./candidate";

export function useCandidatesViewModel(): CandidateViewModel[] {
  return useCalculatorStore((state) => state.candidates);
}
