import type { Candidate } from "../../../../../packages/schema/schemas/candidate.schema";
import { type CandidateViewModel, candidateViewModel } from "./candidate";
import type { OrganizationViewModel } from "./organization";
import type { PersonViewModel } from "./person";

export function candidatesViewModel(candidates: Candidate[], personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): CandidateViewModel[] {
  return candidates.map((candidate) => candidateViewModel(candidate, personsMap, organizationsMap));
}
