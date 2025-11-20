import { isPrefix } from "./validators";

function parseOneSegmentParams({ first }: { first: string }): { key: string; group: string | undefined } {
  return { key: first, group: undefined };
}

function parseTwoSegmentParams({ first, second }: { first: string; second: string }): { key: string; group: string | undefined } {
  if (isPrefix(first)) {
    return { key: second, group: undefined };
  }
  return { key: first, group: second };
}

function parseThreeSegmentParams({ second, third }: { first: string; second: string; third: string }): { key: string; group: string | undefined } {
  return { key: second, group: third };
}

export const params = {
  fromOneSegment: (params: { first: string }) => parseOneSegmentParams(params),
  fromTwoSegments: (params: { first: string; second: string }) => parseTwoSegmentParams(params),
  fromThreeSegments: (params: { first: string; second: string; third: string }) => parseThreeSegmentParams(params),
} as const;
