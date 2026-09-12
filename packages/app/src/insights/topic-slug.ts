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
 *
 * Latin-only, so a name written in another script — the Macedonian
 * calculator's Cyrillic topics, say — has nothing left once the rule has run.
 * That is `undefined`, not the empty string: a topic with no slug has no
 * address, and every caller that would build a link from it has to say so
 * (the dashboard shows such a row as plain text) rather than write an empty
 * filter into a URL. A Unicode-aware rule is a separate change; until then
 * this is the honest answer.
 */
export function topicSlug(topic: string): string | undefined {
  const slug = topic
    .normalize("NFD")
    // Combining diacritical marks (U+0300–U+036F), written as an escape rather
    // than typed literally — a typed range is invisible in review and a
    // reformat can eat it.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || undefined;
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
