import type { Candidate } from "@kalkulacka-one/schema";

import { type CandidateViewModel, candidateViewModel } from "./candidate";
import type { OrganizationViewModel } from "./organization";
import type { PersonViewModel } from "./person";

export function candidatesViewModel(candidates: Candidate[], personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>, baseUrl: string): CandidateViewModel[] {
  return candidates.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap, baseUrl));
}
