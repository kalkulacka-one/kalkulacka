import { createBaseSegment, type RouteSegments, routes } from "./route-builders";

function buildCanonicalUrl(path: string): string {
  const NEXT_PUBLIC_CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL;
  if (!NEXT_PUBLIC_CANONICAL_URL) {
    throw new Error("Missing `NEXT_PUBLIC_CANONICAL_URL` environment variable");
  }
  const baseUrl = NEXT_PUBLIC_CANONICAL_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export const canonical = {
  homepage: (): string => buildCanonicalUrl("/"),
  base: (segments: RouteSegments): string => buildCanonicalUrl(createBaseSegment(segments)),
  introduction: (segments: RouteSegments): string => buildCanonicalUrl(routes.introduction(segments)),
  guide: (segments: RouteSegments): string => buildCanonicalUrl(routes.guide(segments)),
  question: (segments: RouteSegments, questionNumber: number): string => buildCanonicalUrl(routes.question(segments, questionNumber)),
  review: (segments: RouteSegments): string => buildCanonicalUrl(routes.review(segments)),
  result: (segments: RouteSegments): string => buildCanonicalUrl(routes.result(segments)),
  comparison: (segments: RouteSegments): string => buildCanonicalUrl(routes.comparison(segments)),
} as const;
