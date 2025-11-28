import { useMemo } from "react";

import { useCalculatorStore } from "@/stores";
import type { CandidateViewModel } from "@/view-models/server/candidate";
import { candidatesViewModel } from "@/view-models/server/candidates";
import { organizationViewModel } from "@/view-models/server/organization";
import { personViewModel } from "@/view-models/server/person";

export function useCandidates(): CandidateViewModel[] {
  const candidates = useCalculatorStore((state) => state.data.candidates);
  const persons = useCalculatorStore((state) => state.data.persons);
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  const personsMap = useMemo(() => new Map(persons?.map((p) => [p.id, personViewModel(p, baseUrl)]) ?? []), [persons, baseUrl]);
  const organizationsMap = useMemo(() => new Map(organizations?.map((o) => [o.id, organizationViewModel(o, baseUrl)]) ?? []), [organizations, baseUrl]);

  return useMemo(() => candidatesViewModel(candidates, personsMap, organizationsMap, baseUrl), [candidates, personsMap, organizationsMap, baseUrl]);
}
