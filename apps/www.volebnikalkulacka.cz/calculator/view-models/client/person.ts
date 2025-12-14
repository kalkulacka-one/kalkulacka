import { type PersonViewModel, personViewModel } from "@kalkulacka-one/app";
import { useCalculatorStore } from "@kalkulacka-one/app/client";

import { useMemo } from "react";

export function usePerson(id: string): PersonViewModel | undefined {
  const persons = useCalculatorStore((state) => state.data.persons);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  return useMemo(() => {
    const person = persons?.find((person) => person.id === id);
    return person ? personViewModel(person, baseUrl) : undefined;
  }, [persons, id, baseUrl]);
}
