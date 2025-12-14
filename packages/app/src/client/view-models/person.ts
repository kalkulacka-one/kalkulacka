import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { type PersonViewModel, personViewModel } from "@/view-models";

export function usePerson(id: string): PersonViewModel | undefined {
  const persons = useCalculatorStore((state) => state.data.persons);
  const baseUrl = useCalculatorStore((state) => state.baseUrl);

  return useMemo(() => {
    const person = persons?.find((person) => person.id === id);
    return person ? personViewModel(person, baseUrl) : undefined;
  }, [persons, id, baseUrl]);
}
