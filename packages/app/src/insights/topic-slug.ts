// Ported from kalkulacka-2026/packages/core/src/routing/routes.ts (`slugifyDistrict`) and
// apps/web/lib/comparison-filters.ts (the topic half of `comparisonFilterSlug`).

/**
 * A topic name as a URL segment — "Životní prostředí" → "zivotni-prostredi".
 *
 * What lets a dashboard card hand the app a filter it can put in a link and
 * a filtered comparison survive being shared. The same "Czech words to a path
 * segment" rule 2026 used for district names: decomposed, the combining marks
 * dropped, lowercased, everything that isn't a letter or a digit collapsed to
 * one hyphen, and the ends trimmed.
 */
export function topicSlug(topic: string): string {
  return (
    topic
      .normalize("NFD")
      // Combining diacritical marks (U+0300–U+036F), written as an escape rather
      // than typed literally — a typed range is invisible in review and a
      // reformat can eat it.
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * The inverse, resolved against the calculator's actual topics. Anything that
 * matches nothing — a stale link, a typo — resolves to `undefined` rather
 * than an error, so the reader still lands on the view they were promised,
 * just unfiltered.
 */
export function topicFromSlug(slug: string | undefined, topics: readonly string[]): string | undefined {
  if (!slug) return undefined;
  return topics.find((topic) => topicSlug(topic) === slug);
}
