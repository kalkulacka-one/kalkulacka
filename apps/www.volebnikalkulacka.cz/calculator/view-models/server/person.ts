import type { Image } from "../../../../../packages/schema/schemas/images.schema";
import type { Person } from "../../../../../packages/schema/schemas/person.schema";

export type PersonViewModel = Person & {
  displayName: string;
  avatarImage?: Image;
};

function getPersonDisplayName(person: Person): string {
  return person.name || `${person.givenName || ""} ${person.familyName || ""}`.trim();
}

function getPersonAvatarImage(person: Person): Image | undefined {
  return person.images?.find((image) => image.type === "avatar" || image.type === "portrait");
}

export function personViewModel(person: Person): PersonViewModel {
  return {
    ...person,
    displayName: getPersonDisplayName(person),
    avatarImage: getPersonAvatarImage(person),
  };
}
