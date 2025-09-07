import { useMemo } from "react";

import type { Candidate } from "../../../../packages/schema/schemas/candidate.schema";
import type { Organization } from "../../../../packages/schema/schemas/organization.schema";
import type { Person } from "../../../../packages/schema/schemas/person.schema";
import { useCalculatorStore } from "../stores";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

export type CandidateViewModel = Omit<Candidate, "nestedCandidates"> & {
  displayName: string | undefined;
  nestedCandidates?: CandidateViewModel[];
};

function getCandidateDisplayName(
  candidate: Candidate,
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): string | undefined {
  if (candidate.displayName) {
    return candidate.displayName;
  }

  const firstReference = candidate.references?.[0];
  if (firstReference) {
    if (firstReference.type === "person") {
      return personsMap.get(firstReference.id)?.displayName;
    }
    if (firstReference.type === "organization") {
      return organizationsMap.get(firstReference.id)?.displayName;
    }
  }

  return undefined;
}

export function candidateViewModel(
  candidate: Candidate,
  personsMap: Map<string, ReturnType<typeof personViewModel>>,
  organizationsMap: Map<string, ReturnType<typeof organizationViewModel>>,
): CandidateViewModel {
  const displayName = getCandidateDisplayName(candidate, personsMap, organizationsMap);
  const nestedCandidates = candidate.nestedCandidates?.map((nested) => candidateViewModel(nested, personsMap, organizationsMap));

  return {
    ...candidate,
    displayName,
    nestedCandidates,
  };
}

export function useCandidate(id: string): CandidateViewModel | undefined {
  const candidates = useCalculatorStore((state) => state.candidates);
  const persons = useCalculatorStore((state) => state.persons);
  const organizations = useCalculatorStore((state) => state.organizations);

  const personsMap = useMemo(() => new Map(persons.map((p) => [p.id, personViewModel(p)])), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations.map((o) => [o.id, organizationViewModel(o)])), [organizations]);

  return useMemo(() => {
    const candidate = candidates.find((candidate) => candidate.id === id);
    return candidate ? candidateViewModel(candidate, personsMap, organizationsMap) : undefined;
  }, [candidates, personsMap, organizationsMap, id]);
}
