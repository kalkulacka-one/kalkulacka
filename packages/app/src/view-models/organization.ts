import type { ImageUrls, Organization } from "@kalkulacka-one/schema";

import { findImageByType, resolveImageUrls } from "@/data-fetching";

export type OrganizationViewModel = Organization & {
  /**
   * The short form, kept as it always was — the legacy screens read it.
   * The new screens pick `name` or `shortName` for the place a name sits in.
   */
  displayName: string;
  /**
   * The preferred full name, e.g. "Svoboda a přímá demokracie" — what a
   * ranking row is headed by. Always set: the schema requires it.
   */
  name: string;
  /**
   * The short form for tight places — a column heading over a mark, an avatar's
   * caption: `shortName`, else the abbreviation, else the full name. The same
   * resolution 2026's platform adapter used, so the two screens agree on what
   * "SPD" is short for.
   */
  shortName: string;
  avatar?: {
    type: "avatar" | "logo";
    urls: ImageUrls;
  };
};

function getOrganizationDisplayName(organization: Organization): string {
  return organization.shortName || organization.abbreviation || organization.name;
}

function getOrganizationShortName(organization: Organization): string {
  return organization.shortName ?? organization.abbreviation ?? organization.name;
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
    name: organization.name,
    shortName: getOrganizationShortName(organization),
    avatar: getOrganizationAvatar(organization, baseUrl),
  };
}
