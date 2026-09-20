import type { DistrictPickerRowViewModel, DistrictPickerSectionViewModel } from "@/view-models";

export type DistrictPickerMatch = DistrictPickerRowViewModel & { matchedAlias?: string; parentTitle?: string };

export function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function startsAWord(haystack: string, needle: string): boolean {
  return haystack.split(/[^\p{L}\p{N}]+/u).some((word) => word.startsWith(needle));
}

// Lower is better: a district named like the query, then one whose name has such a word, then a matching code, then a
// place inside the district, then anything that merely contains the query somewhere.
export function matchRank(row: DistrictPickerRowViewModel, needle: string): { rank: number; matchedAlias?: string } | undefined {
  const names = [row.title, row.shortTitle].filter((name) => name !== undefined).map(normalize);
  if (names.some((name) => name.startsWith(needle))) return { rank: 0 };
  if (names.some((name) => startsAWord(name, needle))) return { rank: 1 };
  if (row.code?.toLowerCase().startsWith(needle)) return { rank: 2 };
  const aliasWord = row.aliases?.find((alias) => startsAWord(normalize(alias), needle));
  if (aliasWord) return { rank: 3, matchedAlias: aliasWord };
  if (names.some((name) => name.includes(needle))) return { rank: 4 };
  const aliasInside = row.aliases?.find((alias) => normalize(alias).includes(needle));
  if (aliasInside) return { rank: 4, matchedAlias: aliasInside };
  return undefined;
}

function flatten(rows: DistrictPickerRowViewModel[], parentTitle?: string): DistrictPickerMatch[] {
  return rows.flatMap((row) => [{ ...row, children: undefined, parentTitle }, ...flatten(row.children ?? [], row.title)]);
}

export function searchRows(sections: DistrictPickerSectionViewModel[], query: string): DistrictPickerMatch[] {
  const needle = normalize(query.trim());
  if (!needle) return [];
  const ranked = flatten(sections.flatMap((section) => section.rows)).flatMap((row) => {
    const match = matchRank(row, needle);
    return match ? [{ row: { ...row, matchedAlias: match.matchedAlias }, rank: match.rank }] : [];
  });
  return ranked.sort((a, b) => a.rank - b.rank).map((entry) => entry.row);
}

export function collectTargets(rows: DistrictPickerRowViewModel[], into: string[]): void {
  for (const row of rows) {
    if (row.href) into.push(row.href);
    if (row.children) collectTargets(row.children, into);
  }
}
