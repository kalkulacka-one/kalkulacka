import type { RouteSegments } from "./route-builders";
import { isPrefix } from "./validators";

function parseKey(segments: RouteSegments): string {
  const { first } = segments;

  // Three-segment: last segment is third
  if (segments.second && segments.third) {
    return segments.third;
  }

  // Two-segment: last segment is second (regardless of prefix)
  if (segments.second) {
    return segments.second;
  }

  // One-segment: last segment is first
  return first;
}

function parseGroup(segments: RouteSegments): string | undefined {
  const { first } = segments;

  // Three-segment: second-to-last segment is second
  if (segments.third) {
    return segments.second;
  }

  // Two-segment: second-to-last segment is first (unless first is a prefix)
  if (segments.second) {
    if (isPrefix(first)) {
      return undefined; // Prefix doesn't count as group
    }
    return first;
  }

  // One-segment: no group
  return undefined;
}

export const mappedParams = {
  key: (segments: RouteSegments) => parseKey(segments),
  group: (segments: RouteSegments) => parseGroup(segments),
} as const;
