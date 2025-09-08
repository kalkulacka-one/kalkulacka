import { useMemo } from "react";

import type { Person } from "../../../../packages/schema/schemas/person.schema";
import { useCalculatorStore } from "../stores";

export type PersonViewModel = Person & {
  displayName: string;
};

function getPersonDisplayName(person: Person): string {
  return person.name || `${person.givenName || ""} ${person.familyName || ""}`.trim();
}

export function personViewModel(person: Person): PersonViewModel {
  return {
    ...person,
    displayName: getPersonDisplayName(person),
  };
}

export function usePerson(id: string): PersonViewModel | undefined {
  const persons = useCalculatorStore((state) => state.persons);

  return useMemo(() => {
    const person = persons.find((person) => person.id === id);
    return person ? personViewModel(person) : undefined;
  }, [persons, id]);
}
