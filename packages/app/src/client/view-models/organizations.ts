import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type OrganizationViewModel, organizationsViewModel } from "@/view-models";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
