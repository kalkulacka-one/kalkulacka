import { useMemo } from "react";

import { type OrganizationViewModel, organizationsViewModel } from "../../server";
import { useCalculatorStore } from "../../stores";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
