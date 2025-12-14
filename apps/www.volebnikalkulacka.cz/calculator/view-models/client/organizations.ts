import { type OrganizationViewModel, organizationsViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
