import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type OrganizationViewModel, organizationViewModel } from "../server/organization";

export function useOrganization(id: string): OrganizationViewModel | undefined {
  const organizations = useCalculatorStore((state) => state.organizations);

  return useMemo(() => {
    const organization = organizations?.find((organization) => organization.id === id);
    return organization ? organizationViewModel(organization) : undefined;
  }, [organizations, id]);
}
