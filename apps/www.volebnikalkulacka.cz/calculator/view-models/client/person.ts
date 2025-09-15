import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import { type PersonViewModel, personViewModel } from "../server/person";

export function usePerson(id: string): PersonViewModel | undefined {
  const persons = useCalculatorStore((state) => state.persons);

  return useMemo(() => {
    const person = persons?.find((person) => person.id === id);
    return person ? personViewModel(person) : undefined;
  }, [persons, id]);
}
