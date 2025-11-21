import type { RouteSegments } from "./route-builders";
import { isPrefix } from "./validators";

function parseKey(params: RouteSegments): string {
  const { first } = params;

  if (params.third) {
    return params.second!;
  }

  if (params.second) {
    if (isPrefix(first)) {
      return params.second;
    }
    return first;
  }

  return first;
}

function parseGroup(params: RouteSegments): string | undefined {
  const { first } = params;

  if (params.third) {
    return params.third;
  }

  if (params.second) {
    if (isPrefix(first)) {
      return undefined;
    }
    return params.second;
  }

  return undefined;
}

export const mappedParams = {
  key: (params: RouteSegments) => parseKey(params),
  group: (params: RouteSegments) => parseGroup(params),
} as const;
