import { useMemo } from "react";

import type { Person } from "../../../../packages/schema/schemas/person.schema";
import { useCalculatorStore } from "../stores";

export type PersonViewModel = Person;

export function personViewModel(person: Person): PersonViewModel {
  return person;
}

export function usePerson(id: string): PersonViewModel | undefined {
  const persons = useCalculatorStore((state) => state.persons);

  return useMemo(() => {
    const person = persons.find((person) => person.id === id);
    return person ? personViewModel(person) : undefined;
  }, [persons, id]);
}
