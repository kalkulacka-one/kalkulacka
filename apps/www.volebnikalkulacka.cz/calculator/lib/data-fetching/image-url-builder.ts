import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";

export function findImageByType(images: { type: string; urls: ImageUrls }[] | undefined, type: string): { urls: ImageUrls } | undefined {
  return images?.find((img) => img.type === type);
}

export function resolveImageUrls(imageUrls: ImageUrls, baseUrl: string): ImageUrls {
  const resolved = {} as ImageUrls;
  for (const [key, value] of Object.entries(imageUrls)) {
    if (value) {
      resolved[key as keyof ImageUrls] = `${baseUrl}/${value}`;
    }
  }
  return resolved;
}
