import type { Organization } from "../../../../../packages/schema/schemas/organization.schema";

export type OrganizationViewModel = Organization & {
  displayName: string;
};

function getOrganizationDisplayName(organization: Organization): string {
  return organization.shortName || organization.abbreviation || organization.name;
}

export function organizationViewModel(organization: Organization): OrganizationViewModel {
  return {
    ...organization,
    displayName: getOrganizationDisplayName(organization),
  };
}
