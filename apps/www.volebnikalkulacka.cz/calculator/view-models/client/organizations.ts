import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type OrganizationViewModel, organizationsViewModel } from "../server";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
