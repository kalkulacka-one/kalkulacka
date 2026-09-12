import type { RouteSegments } from "@/routing/segments";
import { isPrefix } from "@/routing/validators";

export function createParamsMapper({ prefixes }: { prefixes: string[] }) {
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
      if (isPrefix({ segment: first, validPrefixes: prefixes })) {
        return undefined;
      }
      return first;
    }

    return undefined;
  }

  const mappedParams = {
    key: (segments: RouteSegments) => parseKey(segments),
    group: (segments: RouteSegments) => parseGroup(segments),
  } as const;

  return { mappedParams };
}
