import { useMemo } from "react";

import type { Person } from "../../../../packages/schema/schemas/person.schema";
import { useCalculatorStore } from "../stores";
import { type PersonViewModel, personViewModel } from "./person";

export function personsViewModel(persons: Person[] | undefined): PersonViewModel[] {
  return persons?.map(personViewModel) ?? [];
}

export function usePersons(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.persons);
  return useMemo(() => personsViewModel(persons), [persons]);
}
