import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";
import type { Person } from "../../../../../packages/schema/schemas/person.schema";
import { findImageByType, resolveImageUrls } from "../../lib/data-fetching/image-url-builder";

export type PersonViewModel = Person & {
  displayName: string;
  avatarUrls?: ImageUrls;
};

function getPersonDisplayName(person: Person): string {
  return person.name || `${person.givenName || ""} ${person.familyName || ""}`.trim();
}

function getPersonAvatarUrls(person: Person, baseUrl: string): ImageUrls | undefined {
  const avatar = findImageByType(person.images, "avatar");
  if (avatar) return resolveImageUrls(avatar.urls, baseUrl);

  const portrait = findImageByType(person.images, "portrait");
  if (portrait) return resolveImageUrls(portrait.urls, baseUrl);

  return undefined;
}

export function personViewModel(person: Person, baseUrl: string): PersonViewModel {
  return {
    ...person,
    displayName: getPersonDisplayName(person),
    avatarUrls: getPersonAvatarUrls(person, baseUrl),
  };
}
