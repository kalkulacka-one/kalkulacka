import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";
import type { Person } from "../../../../../packages/schema/schemas/person.schema";
import { findImageByType, resolveImageUrls } from "../../lib/data-fetching/image-url-builder";

export type PersonViewModel = Person & {
  displayName: string;
  avatar?: {
    type: "avatar" | "portrait";
    urls: ImageUrls;
  };
};

function getPersonDisplayName(person: Person): string {
  return person.name || `${person.givenName || ""} ${person.familyName || ""}`.trim();
}

function getPersonAvatar(person: Person, baseUrl: string): { type: "avatar" | "portrait"; urls: ImageUrls } | undefined {
  const avatar = findImageByType(person.images, "avatar");
  if (avatar) return { type: "avatar", urls: resolveImageUrls(avatar.urls, baseUrl) };

  const portrait = findImageByType(person.images, "portrait");
  if (portrait) return { type: "portrait", urls: resolveImageUrls(portrait.urls, baseUrl) };

  return undefined;
}

export function personViewModel(person: Person, baseUrl: string): PersonViewModel {
  return {
    ...person,
    displayName: getPersonDisplayName(person),
    avatar: getPersonAvatar(person, baseUrl),
  };
}
