// Ported from kalkulacka-2026/apps/web/lib/topic-icons.ts and apps/web/config/topic-icon-rules.ts
import type { IconName } from "@kalkulacka-one/design-system/icons";

/**
 * Which icon stands for a topic.
 *
 * The matching mechanism lives in `topicIcon` — take a topic name, normalize
 * it, and test it against a set of keyword patterns to land on an icon.
 * Anything unrecognised gets the neutral bookmark rather than a guess: an
 * icon that claims the wrong subject is worse than one that claims none.
 *
 * The rules themselves — the keyword patterns and their icons — are
 * editorial knowledge. 2026 kept them in the app's config, one file per
 * site; here they sit beside the mechanism as a table the app can extend,
 * since the package serves more than one country and none of them has a
 * config of its own yet. Adding a country adds rows here.
 */

/**
 * Topic icon rules — Czech editorial knowledge.
 *
 * Keyword patterns matched against normalized Czech topic tags. Regexes are
 * tried in order; the first match wins. Order matters where tags could match
 * twice: "veřejný pořádek" and "veřejné služby" share a stem, so the more
 * specific pair is listed before anything that matches "verejn" alone.
 */
export const TOPIC_ICON_RULES: readonly (readonly [RegExp, IconName])[] = [
  [/doprav|parkov|mhd|cykl/, "topicTransport"],
  [/bydlen|byt|nemovit|uzemn|urbanis/, "topicHousing"],
  [/energet|teplo|energi|odpad/, "topicEnergy"],
  [/skols|vzdelav|skol/, "topicEducation"],
  [/socialn|zdravot|senior|rodin/, "topicSocial"],
  [/zivotni prostred|ekolog|zelen|klima/, "topicEnvironment"],
  [/kultur|sport|volny cas|turis/, "topicCulture"],
  [/poradek|bezpecn|kriminal|policie/, "topicSafety"],
  [/rozpoc|financ|dane|dotac|investic/, "topicBudget"],
  [/transparen|korupc|otevren|radnice/, "topicTransparency"],
  [/sluzb|sprav|infrastruktur|verejn/, "topicServices"],
];

/**
 * Diacritics stripped so "Životní" and "zivotni" are the same key to match on.
 *
 * Uses Czech locale for normalization because it applies to Czech topic tags.
 */
function normalize(topic: string): string {
  return topic
    .toLocaleLowerCase("cs")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function topicIcon(topic: string, rules: readonly (readonly [RegExp, IconName])[] = TOPIC_ICON_RULES): IconName {
  const key = normalize(topic);
  return rules.find(([pattern]) => pattern.test(key))?.[1] ?? "topicOther";
}
