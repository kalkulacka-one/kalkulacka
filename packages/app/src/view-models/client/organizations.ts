import { useMemo } from "react";

import { useCalculatorStore } from "@/stores";
import type { OrganizationViewModel } from "@/view-models/server/organization";
import { organizationsViewModel } from "@/view-models/server/organizations";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => organizationsViewModel(organizations, baseUrl), [organizations, baseUrl]);
}
