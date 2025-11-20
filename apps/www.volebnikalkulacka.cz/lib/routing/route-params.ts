import { allowedPrefixGuard } from "./guards";
import { isAllowedPrefix } from "./validators";

function parseTwoSegmentCalculatorParams(first: string, second: string): { key: string; group?: string } {
  if (isAllowedPrefix(first)) {
    allowedPrefixGuard(first);
    return { key: second };
  }
  return { key: second, group: first };
}

function parseTwoSegmentMetadataParams(first: string, second: string): { key: string; group?: string } {
  if (isAllowedPrefix(first)) {
    return { key: second };
  }
  return { key: second, group: first };
}

export const params = {
  twoSegmentCalculator: (first: string, second: string) => parseTwoSegmentCalculatorParams(first, second),
  twoSegmentMetadata: (first: string, second: string) => parseTwoSegmentMetadataParams(first, second),
} as const;
