import { isPrefix } from "./validators";

type RouteParams = { first: string } | { first: string; second: string } | { first: string; second: string; third: string };

function parseKey(params: RouteParams): string {
  const { first } = params;

  if ("third" in params) {
    // Three segments: /{prefix}/{key}/{group}
    return params.second;
  }

  if ("second" in params) {
    // Two segments: /{prefix}/{key} or /{key}/{group}
    if (isPrefix(first)) {
      return params.second;
    }
    return first;
  }

  // One segment: /{key}
  return first;
}

function parseGroup(params: RouteParams): string | undefined {
  const { first } = params;

  if ("third" in params) {
    // Three segments: /{prefix}/{key}/{group}
    return params.third;
  }

  if ("second" in params) {
    // Two segments: /{prefix}/{key} or /{key}/{group}
    if (isPrefix(first)) {
      return undefined;
    }
    return params.second;
  }

  // One segment: /{key}
  return undefined;
}

export const params = {
  key: (params: RouteParams) => parseKey(params),
  group: (params: RouteParams) => parseGroup(params),
} as const;
