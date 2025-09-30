"use client";

import type { Image } from "../../../../../../packages/schema/schemas/images.schema";
import { useRouteSegments } from "../../../contexts/route-segments";

export type AvatarProps = {
  avatarImage?: Image;
};

function buildImageUrl(imagePath: string, key?: string, group?: string): string {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_DATA_ENDPOINT || "https://data.kalkulacka.one";

  const dataKey = key || "snemovni-2025";
  const dataGroup = group || "inventura";

  const path = dataGroup ? `www.volebnikalkulacka.cz/${dataKey}/${dataGroup}` : `www.volebnikalkulacka.cz/${dataKey}`;

  return `${baseUrl}/${path}/${imagePath}`;
}

export function Avatar({ avatarImage }: AvatarProps) {
  const segments = useRouteSegments();

  if (!avatarImage) {
    return <div className="h-14 w-14 rounded-2xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">No Image</div>;
  }

  const imageSrc = avatarImage.urls.sm || avatarImage.urls.original;
  const fullImageUrl = buildImageUrl(imageSrc, segments?.first, segments?.second);

  return <img src={fullImageUrl} alt={avatarImage.alt || "Avatar"} className="h-14 w-14 rounded-2xl object-cover" />;
}
