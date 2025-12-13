import type { Organization } from "@kalkulacka-one/schema";

import { type OrganizationViewModel, organizationViewModel } from "./organization";

export function organizationsViewModel(organizations: Organization[] | undefined, baseUrl: string): OrganizationViewModel[] {
  return organizations?.map((organization) => organizationViewModel(organization, baseUrl)) ?? [];
}
