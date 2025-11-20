import { isPrefix } from "./validators";

type RouteParams = { first: string } | { first: string; second: string } | { first: string; second: string; third: string };

function parseKey(params: RouteParams): string {
  const { first } = params;

  if ("third" in params) {
    return params.second;
  }

  if ("second" in params) {
    if (isPrefix(first)) {
      return params.second;
    }
    return first;
  }

  return first;
}

function parseGroup(params: RouteParams): string | undefined {
  const { first } = params;

  if ("third" in params) {
    return params.third;
  }

  if ("second" in params) {
    if (isPrefix(first)) {
      return undefined;
    }
    return params.second;
  }

  return undefined;
}

export const params = {
  key: (params: RouteParams) => parseKey(params),
  group: (params: RouteParams) => parseGroup(params),
} as const;
