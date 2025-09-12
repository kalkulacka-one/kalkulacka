import type { Candidate } from "../../../../../packages/schema/schemas/candidate.schema";
import { type OrganizationViewModel, organizationViewModel } from "./organization";
import { type PersonViewModel, personViewModel } from "./person";

export type CandidateViewModel = Omit<Candidate, "nestedCandidates"> & {
  displayName: string | undefined;
  organization?: string | undefined;
  nestedCandidates?: CandidateViewModel[];
};

function getCandidateDisplayName(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): string | undefined {
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

function getCandidateOrganization(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): string | undefined {
  const firstReference = candidate.references?.[0];
  if (firstReference?.type === "person") {
    const person = personsMap.get(firstReference.id);
    if (person?.memberOf && person.memberOf.length > 0) {
      const firstOrganizationId = person.memberOf[0]?.id;
      return firstOrganizationId ? organizationsMap.get(firstOrganizationId)?.displayName : undefined;
    }
  }

  return undefined;
}

export function candidateViewModel(candidate: Candidate, personsMap: Map<string, PersonViewModel>, organizationsMap: Map<string, OrganizationViewModel>): CandidateViewModel {
  const displayName = getCandidateDisplayName(candidate, personsMap, organizationsMap);
  const organization = getCandidateOrganization(candidate, personsMap, organizationsMap);
  const nestedCandidates = candidate.nestedCandidates?.map((nested) => candidateViewModel(nested, personsMap, organizationsMap));

  return {
    ...candidate,
    displayName,
    organization,
    nestedCandidates,
  };
}
