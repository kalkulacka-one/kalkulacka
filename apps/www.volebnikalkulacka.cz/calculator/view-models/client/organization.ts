import { useMemo } from "react";

import { useCalculatorStore } from "@/calculator/stores";

import { type OrganizationViewModel, organizationViewModel } from "../server/organization";

export function useOrganization(id: string): OrganizationViewModel | undefined {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  return useMemo(() => {
    const organization = organizations?.find((organization) => organization.id === id);
    return organization ? organizationViewModel(organization, baseUrl) : undefined;
  }, [organizations, id, baseUrl]);
}
