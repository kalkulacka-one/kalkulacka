import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import type { CandidateViewModel } from "../server/candidate";
import { candidatesViewModel } from "../server/candidates";
import { organizationViewModel } from "../server/organization";
import { personViewModel } from "../server/person";

export function useCandidates(): CandidateViewModel[] {
  const candidates = useCalculatorStore((state) => state.data.candidates);
  const persons = useCalculatorStore((state) => state.data.persons);
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p, baseUrl)]) ?? []), [persons, baseUrl]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o, baseUrl)]) ?? []), [organizations, baseUrl]);

  return useMemo(() => candidatesViewModel(candidates, personsMap, organizationsMap, baseUrl), [candidates, personsMap, organizationsMap, baseUrl]);
}
