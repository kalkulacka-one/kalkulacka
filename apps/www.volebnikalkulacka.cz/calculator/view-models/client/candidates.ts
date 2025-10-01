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

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p)]) ?? []), [persons]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o)]) ?? []), [organizations]);

  return useMemo(() => candidatesViewModel(candidates, personsMap, organizationsMap), [candidates, personsMap, organizationsMap]);
}
