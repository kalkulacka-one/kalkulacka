import type { Person } from "../../../../../packages/schema/schemas/person.schema";
import { type PersonViewModel, personViewModel } from "./person";

export function personsViewModel(persons: Person[] | undefined, baseUrl: string): PersonViewModel[] {
  return persons?.map((person) => personViewModel(person, baseUrl)) ?? [];
}
