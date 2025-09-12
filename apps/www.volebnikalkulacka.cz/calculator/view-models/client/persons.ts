import { useMemo } from "react";

import { useCalculatorStore } from "../../stores";
import type { PersonViewModel } from "../server/person";
import { personsViewModel } from "../server/persons";

export function usePersonsViewModel(): PersonViewModel[] {
  const persons = useCalculatorStore((state) => state.persons);
  return useMemo(() => personsViewModel(persons), [persons]);
}
