import { useMemo } from "react";

import type { Organization } from "../../../../packages/schema/schemas/organization.schema";
import { useCalculatorStore } from "../stores";

export type OrganizationViewModel = Organization;

export function organizationViewModel(organization: Organization): OrganizationViewModel {
  return organization;
}

export function useOrganization(id: string): OrganizationViewModel | undefined {
  const organizations = useCalculatorStore((state) => state.organizations);

  return useMemo(() => {
    const organization = organizations.find((organization) => organization.id === id);
    return organization ? organizationViewModel(organization) : undefined;
  }, [organizations, id]);
}
