import { useMemo } from "react";

import { type OrganizationViewModel, organizationsViewModel } from "@/calculator";
import { useCalculatorStore } from "@/calculator/client";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
