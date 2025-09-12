import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type CandidateViewModel, candidateViewModel } from "../server/candidate";
import { organizationViewModel } from "../server/organization";
import { personViewModel } from "../server/person";

export function useCandidate(id: string): CandidateViewModel | undefined {
  const candidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o)]) ?? []), [organizations]);

  return useMemo(() => {
    const candidate = candidates.find((candidate) => candidate.id === id);
    return candidate ? candidateViewModel(candidate, personsMap, organizationsMap) : undefined;
  }, [candidates, personsMap, organizationsMap, id]);
}
