import { useMemo } from "react";

import type { Candidate } from "../../../../packages/schema/schemas/candidate.schema";
import { useCalculatorStore } from "../stores";
import { type CandidateViewModel, candidateViewModel } from "./candidate";

export function candidatesViewModel(candidates: Candidate[]): CandidateViewModel[] {
  return candidates.map(candidateViewModel);
}

export function useCandidatesViewModel(): CandidateViewModel[] {
  const candidates = useCalculatorStore((state) => state.candidates);
  return useMemo(() => candidatesViewModel(candidates), [candidates]);
}
