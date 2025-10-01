import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import type { OrganizationViewModel } from "../server/organization";
import { organizationsViewModel } from "../server/organizations";

export function useOrganizations(): OrganizationViewModel[] {
  const organizations = useCalculatorStore((state) => state.data.organizations);
  return useMemo(() => organizationsViewModel(organizations), [organizations]);
}
