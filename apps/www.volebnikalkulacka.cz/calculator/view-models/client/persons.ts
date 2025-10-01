import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import type { PersonViewModel } from "../server/person";
import { personsViewModel } from "../server/persons";

export function usePersons(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.data.persons);
  return useMemo(() => personsViewModel(persons), [persons]);
}
