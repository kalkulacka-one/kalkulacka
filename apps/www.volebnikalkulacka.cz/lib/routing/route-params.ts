import { allowedPrefixGuard } from "./guards";
import { isAllowedPrefix } from "./validators";

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
