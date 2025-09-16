import type { Person } from "../../../../../packages/schema/schemas/person.schema";

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
