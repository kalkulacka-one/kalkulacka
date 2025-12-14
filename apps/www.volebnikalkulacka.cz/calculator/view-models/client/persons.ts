import { type PersonViewModel, personsViewModel } from "@kalkulacka-one/app";

import { useMemo } from "react";

import { useCalculatorStore } from "@kalkulacka-one/app/client";

export function usePersons(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.data.persons);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);
  return useMemo(() => personsViewModel(persons, baseUrl), [persons, baseUrl]);
}
