import { type OrganizationViewModel, organizationsViewModel } from "@kalkulacka-one/app";

import { useMemo } from "react";

import { useCalculatorStore } from "@kalkulacka-one/app/client";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
