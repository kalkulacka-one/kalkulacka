import { createBaseSegment, type RouteSegments, routes } from "./route-builders";

export function buildCanonicalUrl(path: string): string {
  const NEXT_PUBLIC_CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL;
  if (!NEXT_PUBLIC_CANONICAL_URL) {
    throw new Error("Missing `NEXT_PUBLIC_CANONICAL_URL` environment variable");
  }
  const baseUrl = NEXT_PUBLIC_CANONICAL_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

function stripEmbed(segments: RouteSegments): RouteSegments {
  const { embed: _embed, ...rest } = segments;
  return rest;
}

export const canonical = {
  homepage: (): string => buildCanonicalUrl("/"),
  base: (segments: RouteSegments): string => buildCanonicalUrl(createBaseSegment(stripEmbed(segments))),
  introduction: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.introduction(stripEmbed(segments), locale)),
  guide: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.guide(stripEmbed(segments), locale)),
  question: (segments: RouteSegments, questionNumber: number, locale: string): string => buildCanonicalUrl(routes.question(stripEmbed(segments), questionNumber, locale)),
  review: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.review(stripEmbed(segments), locale)),
  result: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.result(stripEmbed(segments), locale)),
  publicResult: (segments: RouteSegments, publicId: string, locale: string): string => buildCanonicalUrl(routes.publicResult(stripEmbed(segments), publicId, locale)),
  comparison: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.comparison(stripEmbed(segments), locale)),
} as const;
