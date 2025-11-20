import { allowedPrefixGuard } from "./guards";
import { isAllowedPrefix } from "./validators";

/**
 * Determines calculator data loading parameters for one-segment routes.
 *
 * One-segment routes use direct mapping:
 * - Returns: key = first segment (calculator key)
 * - Example: /green-deal → key: "green-deal"
 */
export function getOneSegmentParams(first: string): { key: string } {
  return { key: first };
}

/**
 * Determines calculator data loading parameters for two-segment routes.
 *
 * Two-segment routes use backwards mapping (last segment = calculator key):
 * - If first segment is an allowed prefix (e.g., "volby"):
 *   → Validates the prefix
 *   → Returns: key = second segment (calculator key)
 *   → Example: /volby/prezidentske-2028 → key: "prezidentske-2028"
 *
 * - If first segment is NOT an allowed prefix:
 *   → No validation
 *   → Returns: key = second segment (calculator key), group = first segment
 *   → Example: /inventura-2025/expresni → key: "expresni", group: "inventura-2025"
 */
export function getTwoSegmentCalculatorParams(first: string, second: string): { key: string; group?: string } {
  if (isAllowedPrefix(first)) {
    allowedPrefixGuard(first);
    return { key: second };
  }
  return { key: second, group: first };
}

/**
 * Determines calculator metadata parameters for two-segment routes.
 *
 * Same logic as getTwoSegmentCalculatorParams but without the guard validation
 * (used in metadata generation where we don't want to trigger notFound).
 */
export function getTwoSegmentMetadataParams(first: string, second: string): { key: string; group?: string } {
  if (isAllowedPrefix(first)) {
    return { key: second };
  }
  return { key: second, group: first };
}

/**
 * Determines calculator data loading parameters for three-segment routes.
 *
 * Three-segment routes use backwards mapping with validated prefix:
 * - Validates the prefix (404 on invalid)
 * - Returns: key = third segment (calculator key), group = second segment
 * - Example: /volby/krajske-2026/moravskoslezsky → key: "moravskoslezsky", group: "krajske-2026"
 */
export function getThreeSegmentCalculatorParams(first: string, second: string, third: string): { key: string; group: string } {
  allowedPrefixGuard(first);
  return { key: third, group: second };
}

/**
 * Determines calculator metadata parameters for three-segment routes.
 *
 * Same logic as getThreeSegmentCalculatorParams but without the guard validation
 * (used in metadata generation where we don't want to trigger notFound).
 */
export function getThreeSegmentMetadataParams(first: string, second: string, third: string): { key: string; group: string } {
  return { key: third, group: second };
}
