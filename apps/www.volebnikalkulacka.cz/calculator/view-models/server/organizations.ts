import type { Organization } from "../../../../../packages/schema/schemas/organization.schema";
import { type OrganizationViewModel, organizationViewModel } from "./organization";

export function organizationsViewModel(organizations: Organization[] | undefined, baseUrl: string): OrganizationViewModel[] {
  return organizations?.map((organization) => organizationViewModel(organization, baseUrl)) ?? [];
}
