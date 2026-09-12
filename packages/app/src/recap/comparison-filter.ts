// Ported from kalkulacka-2026/apps/web/lib/comparison-filters.ts — the half that turns a route's filter into the
// recap's filter id and back. The slug half (`slugifyDistrict` there) is `topicSlug` in `@/insights`.
import { topicFromSlug, topicSlug } from "@/insights";

import { RECAP_FILTER_ALL, RECAP_FILTER_IMPORTANT, RECAP_TOPIC_PREFIX, type RecapFilterId, topicFilterId } from "./recap";

/**
 * The comparison page's filter as the app's routes see it: the starred
 * questions, or one topic named by its slug (`topicSlug`) — the form a URL
 * carries and a dashboard link hands over. `undefined` is everything.
 *
 * 2026 wrote this into the route itself (`/porovnani/dulezite`,
 * `/porovnani/<topic>`), which is what lets a dashboard card be a plain link
 * and a filtered view survive being shared. This platform's routes have no
 * such segment, so the app decides where the value goes (the Czech app puts it
 * in a query); the page only speaks in these terms.
 */
export type ComparisonFilter = "important" | { topic: string };

/**
 * A route's filter as the recap's filter id, resolved against the calculator's
 * actual topics. Anything that matches nothing — a stale link, a typo —
 * degrades to "all" rather than an error: the reader still lands on the view
 * they were promised, just unfiltered.
 */
export function comparisonFilterToId(filter: ComparisonFilter | undefined, topics: readonly string[]): RecapFilterId {
  if (filter === undefined) return RECAP_FILTER_ALL;
  if (filter === "important") return RECAP_FILTER_IMPORTANT;

  const topic = topicFromSlug(filter.topic, topics);
  return topic ? topicFilterId(topic) : RECAP_FILTER_ALL;
}

/**
 * The inverse — what the page tells the app when a chip is picked. "All" is no
 * filter at all, and so is a topic that has no slug (a name with no Latin
 * letters or digits in it — `topicSlug` answers `undefined` for those): a
 * filter the URL cannot spell is not offered to it. The recap's "unanswered"
 * is never a comparison filter; it reads as "all" too rather than as a value
 * the routes have no word for.
 */
export function comparisonFilterFromId(id: RecapFilterId): ComparisonFilter | undefined {
  if (id === RECAP_FILTER_IMPORTANT) return "important";
  if (!id.startsWith(RECAP_TOPIC_PREFIX)) return undefined;

  const slug = topicSlug(id.slice(RECAP_TOPIC_PREFIX.length));
  return slug ? { topic: slug } : undefined;
}
