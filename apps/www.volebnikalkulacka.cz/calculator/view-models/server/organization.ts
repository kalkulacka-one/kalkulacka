import { findImageByType, resolveImageUrls } from "@kalkulacka-one/app";
import type { ImageUrls, Organization } from "@kalkulacka-one/schema";

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
