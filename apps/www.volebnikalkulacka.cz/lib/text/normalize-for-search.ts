/**
 * A string reduced to what a typed search should match.
 *
 * Czech city names are full of diacritics that people leave off when typing —
 * "zdar" has to find "Žďár nad Sázavou" — so the comparison runs on the
 * decomposed, mark-stripped, lowercased form of both sides.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("cs");
}
