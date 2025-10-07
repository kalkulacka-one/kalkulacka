import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";
import type { Organization } from "../../../../../packages/schema/schemas/organization.schema";
import { findImageByType, resolveImageUrls } from "../../lib/data-fetching/image-url-builder";

export type OrganizationViewModel = Organization & {
  displayName: string;
  avatar?: {
    type: "avatar" | "logo";
    urls: ImageUrls;
  };
};

function getOrganizationDisplayName(organization: Organization): string {
  return organization.shortName || organization.abbreviation || organization.name;
}

function getOrganizationAvatar(organization: Organization, baseUrl: string): { type: "avatar" | "logo"; urls: ImageUrls } | undefined {
  const avatar = findImageByType(organization.images, "avatar");
  if (avatar) return { type: "avatar", urls: resolveImageUrls(avatar.urls, baseUrl) };

  const logo = findImageByType(organization.images, "logo");
  if (logo) return { type: "logo", urls: resolveImageUrls(logo.urls, baseUrl) };

  return undefined;
}

export function organizationViewModel(organization: Organization, baseUrl: string): OrganizationViewModel {
  return {
    ...organization,
    displayName: getOrganizationDisplayName(organization),
    avatar: getOrganizationAvatar(organization, baseUrl),
  };
}
