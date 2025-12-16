import { isPrefix } from "@kalkulacka-one/next";

import { PREFIXES } from "./prefixes";
import type { RouteSegments } from "./route-builders";

function parseKey(segments: RouteSegments): string {
  const { first } = segments;

  if (segments.second && segments.third) {
    return segments.third;
  }

  if (segments.second) {
    return segments.second;
  }

  return first;
}

function parseGroup(segments: RouteSegments): string | undefined {
  const { first } = segments;

  if (segments.third) {
    return segments.second;
  }

  if (segments.second) {
    if (isPrefix(first, PREFIXES)) {
      return undefined;
    }
    return first;
  }

  return undefined;
}

export const mappedParams = {
  key: (segments: RouteSegments) => parseKey(segments),
  group: (segments: RouteSegments) => parseGroup(segments),
} as const;
