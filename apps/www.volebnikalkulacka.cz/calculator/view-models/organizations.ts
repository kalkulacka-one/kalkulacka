import { useMemo } from "react";

import type { Organization } from "../../../../packages/schema/schemas/organization.schema";
import { useCalculatorStore } from "../stores";
import { type OrganizationViewModel, organizationViewModel } from "./organization";

export function organizationsViewModel(organizations: Organization[] | undefined): OrganizationViewModel[] {
  return organizations?.map(organizationViewModel) ?? [];
}

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.organizations);
  return useMemo(() => organizationsViewModel(organizations), [organizations]);
}
