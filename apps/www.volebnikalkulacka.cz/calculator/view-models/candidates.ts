import { useMemo } from "react";

import type { Candidate } from "../../../../packages/schema/schemas/candidate.schema";
import { useCalculatorStore } from "../stores";
import { type CandidateViewModel, candidateViewModel } from "./candidate";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export function candidatesViewModel(
  candidates: Candidate[],
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): CandidateViewModel[] {
  return candidates.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap));
}

export function useCandidatesViewModel(): CandidateViewModel[] {
  const candidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o)]) ?? []), [organizations]);

  return useMemo(() => candidatesViewModel(candidates, personsMap, organizationsMap), [candidates, personsMap, organizationsMap]);
}
