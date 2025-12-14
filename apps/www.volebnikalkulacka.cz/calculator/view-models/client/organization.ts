import { type OrganizationViewModel, organizationViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useOrganization(id: string): OrganizationViewModel | undefined {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  return useMemo(() => {
    const organization = organizations?.find((organization) => organization.id === id);
    return organization ? organizationViewModel(organization, baseUrl) : undefined;
  }, [organizations, id, baseUrl]);
}
