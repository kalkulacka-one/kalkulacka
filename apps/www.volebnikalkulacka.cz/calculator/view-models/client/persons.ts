import { useMemo } from "react";

import { useCalculatorStore } from "@/calculator/stores";
import type { PersonViewModel } from "@/calculator/view-models/server";
import { personsViewModel } from "@/calculator/view-models/server";

export function usePersons(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.data.persons);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => personsViewModel(persons, baseUrl), [persons, baseUrl]);
}
