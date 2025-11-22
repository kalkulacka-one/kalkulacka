import { useMemo } from "react";

import { useCalculatorStore } from "@/calculator/stores";
import type { OrganizationViewModel } from "@/calculator/view-models/server";
import { organizationsViewModel } from "@/calculator/view-models/server";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
