import type { RouteSegments } from "./route-builders";
import { isPrefix } from "./validators";

function parseKey(segments: RouteSegments): string {
  const { first } = segments;

  if (segments.second && segments.third) {
    return segments.third;
  }

  if (segments.second) {
    if (isPrefix(first)) {
      return segments.second;
    }
    return first;
  }

  return first;
}

function parseGroup(segments: RouteSegments): string | undefined {
  const { first } = segments;

  if (segments.third) {
    return segments.second;
  }

  if (segments.second) {
    if (isPrefix(first)) {
      return undefined;
    }
    return segments.second;
  }

  return undefined;
}

export const mappedParams = {
  key: (segments: RouteSegments) => parseKey(segments),
  group: (segments: RouteSegments) => parseGroup(segments),
} as const;
