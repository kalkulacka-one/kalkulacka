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
  introduction: (segments: RouteSegments): string => buildCanonicalUrl(routes.introduction(stripEmbed(segments))),
  guide: (segments: RouteSegments): string => buildCanonicalUrl(routes.guide(stripEmbed(segments))),
  question: (segments: RouteSegments, questionNumber: number): string => buildCanonicalUrl(routes.question(stripEmbed(segments), questionNumber)),
  review: (segments: RouteSegments): string => buildCanonicalUrl(routes.review(stripEmbed(segments))),
  result: (segments: RouteSegments): string => buildCanonicalUrl(routes.result(stripEmbed(segments))),
  publicResult: (segments: RouteSegments, publicId: string): string => buildCanonicalUrl(routes.publicResult(stripEmbed(segments), publicId)),
  comparison: (segments: RouteSegments): string => buildCanonicalUrl(routes.comparison(stripEmbed(segments))),
} as const;
