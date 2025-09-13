import { createBaseSegment, type RouteSegments, routes } from "./route-builders";

const CANONICAL_URL = process.env.CANONICAL_URL;

function buildCanonicalUrl(path: string): string {
  if (!CANONICAL_URL) {
    throw new Error("Missing `CANONICAL_URL` environment variable");
  }
  const baseUrl = CANONICAL_URL.replace(/\/$/, "");
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
} as const;
