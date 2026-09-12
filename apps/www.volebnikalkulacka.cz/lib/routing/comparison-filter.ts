import type { ComparisonFilter } from "@kalkulacka-one/app";

/**
 * The comparison view's filter, as a query parameter.
 *
 * The URL grammar of kalkulacka-2026/apps/web/lib/comparison-filters.ts, where
 * the filter was a route segment (`/porovnani/dulezite`, `/porovnani/<topic>`).
 * This app's routes have no such segment, so the same two forms ride on
 * `?filtr=` instead: `dulezite` is the starred questions, a topic slug one
 * theme, and no parameter at all is everything — which is what lets a
 * dashboard card be a plain link and a filtered view survive being shared.
 * The topic slug is the app package's `topicSlug`, so a link written by the
 * results page and one typed by hand resolve the same way.
 */
export const COMPARISON_FILTER_PARAM = "filtr";

const IMPORTANT_SLUG = "dulezite";

/** `?filtr=…` for a filter, or the empty string for everything — ready to append to the comparison route. */
export function comparisonFilterQuery(filter: ComparisonFilter | undefined): string {
  if (filter === undefined) return "";

  const value = filter === "important" ? IMPORTANT_SLUG : filter.topic;
  return `?${COMPARISON_FILTER_PARAM}=${encodeURIComponent(value)}`;
}

/**
 * The inverse, from the raw parameter. Whether a topic slug names a real topic
 * is the page's call — it has the calculator's topics, this does not — and a
 * slug that names none degrades to everything there rather than to a 404.
 */
export function parseComparisonFilter(value: string | null | undefined): ComparisonFilter | undefined {
  if (!value) return undefined;
  if (value === IMPORTANT_SLUG) return "important";
  return { topic: value };
}
