import { useMemo } from "react";

import type { Candidate } from "../../../../packages/schema/schemas/candidate.schema";
import { useCalculatorStore } from "../stores";

export type CandidateViewModel = Candidate;

export function candidateViewModel(candidate: Candidate): CandidateViewModel {
  return candidate;
}

export function useCandidate(id: string): CandidateViewModel | undefined {
  const candidates = useCalculatorStore((state) => state.candidates);

  return useMemo(() => {
    const candidate = candidates.find((candidate) => candidate.id === id);
    return candidate ? candidateViewModel(candidate) : undefined;
  }, [candidates, id]);
}
