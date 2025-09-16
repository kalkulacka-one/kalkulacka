import type { Organization } from "../../../../../packages/schema/schemas/organization.schema";
import { type OrganizationViewModel, organizationViewModel } from "./organization";

export function organizationsViewModel(organizations: Organization[] | undefined): OrganizationViewModel[] {
  return organizations?.map(organizationViewModel) ?? [];
}
