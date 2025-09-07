import { useMemo } from "react";

import type { Person } from "../../../../packages/schema/schemas/person.schema";
import { useCalculatorStore } from "../stores";
import { type PersonViewModel, personViewModel } from "./person";

export function personsViewModel(persons: Person[]): PersonViewModel[] {
  return persons.map(personViewModel);
}

export function usePersonsViewModel(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.persons);
  return useMemo(() => personsViewModel(persons), [persons]);
}
