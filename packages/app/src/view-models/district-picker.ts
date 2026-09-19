import type { Calculator, District, Election, ElectionCalculatorGroup, ElectionCalculatorItem } from "@kalkulacka-one/schema";

import { isPublished } from "./published";

export type DistrictPickerRowViewModel = {
  key: string;
  title: string;
  shortTitle?: string;
  code?: string;
  href?: string;
  children?: DistrictPickerRowViewModel[];
  aliases?: string[];
};

export type DistrictPickerSectionViewModel = {
  key: string;
  title?: string;
  rows: DistrictPickerRowViewModel[];
};

export type DistrictPickerViewModel = {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  showCode: boolean;
  sections: DistrictPickerSectionViewModel[];
};

export type DistrictPickerViewModelInput = {
  group: ElectionCalculatorGroup;
  election: Election;
  buildHref: (districtKey: string) => string;
  calculators: Record<string, Calculator>;
  now: Date;
};

type DistrictIndex = {
  byKey: Map<string, District>;
  parentOf: Map<string, District>;
  childrenOf: Map<string, District[]>;
  calculatorsOf: Map<string, ElectionCalculatorItem[]>;
};

function calculatorsByDistrict(group: ElectionCalculatorGroup): Map<string, ElectionCalculatorItem[]> {
  const byDistrict = new Map<string, ElectionCalculatorItem[]>();
  for (const item of group.calculators) {
    if (!item.district) continue;
    const items = byDistrict.get(item.district.key) ?? [];
    items.push(item);
    byDistrict.set(item.district.key, items);
  }
  return byDistrict;
}

function ancestorsOf(district: District, byKey: Map<string, District>): District[] {
  const ancestors: District[] = [];
  const seen = new Set([district.key]);
  let parent = district.parent === undefined ? undefined : byKey.get(district.parent);
  while (parent && !seen.has(parent.key)) {
    ancestors.push(parent);
    seen.add(parent.key);
    parent = parent.parent === undefined ? undefined : byKey.get(parent.parent);
  }
  return parent ? [] : ancestors;
}

function indexDistricts(election: Election, group: ElectionCalculatorGroup): DistrictIndex {
  const byKey = new Map<string, District>();
  for (const district of election.districts ?? []) {
    if (!byKey.has(district.key)) byKey.set(district.key, district);
  }
  const parentOf = new Map<string, District>();
  const childrenOf = new Map<string, District[]>();
  for (const district of byKey.values()) {
    const parent = ancestorsOf(district, byKey)[0];
    if (!parent) continue;
    parentOf.set(district.key, parent);
    const siblings = childrenOf.get(parent.key) ?? [];
    siblings.push(district);
    childrenOf.set(parent.key, siblings);
  }
  return { byKey, parentOf, childrenOf, calculatorsOf: calculatorsByDistrict(group) };
}

function isSection(district: District, index: DistrictIndex): boolean {
  if (index.calculatorsOf.has(district.key) || (index.childrenOf.get(district.key)?.length ?? 0) === 0) return false;
  const parent = index.parentOf.get(district.key);
  return parent === undefined || isSection(parent, index);
}

function isTopLevel(district: District, index: DistrictIndex): boolean {
  return !index.parentOf.has(district.key);
}

function hasCalculatorsBelow(district: District, index: DistrictIndex): boolean {
  return index.calculatorsOf.has(district.key) || (index.childrenOf.get(district.key) ?? []).some((child) => hasCalculatorsBelow(child, index));
}

function districtRow(district: District, index: DistrictIndex, input: DistrictPickerViewModelInput): DistrictPickerRowViewModel {
  const published = (index.calculatorsOf.get(district.key) ?? []).filter((item) => isPublished(input.calculators[item.key], input.now));
  const inside = index.childrenOf.get(district.key) ?? [];
  const children = inside.filter((child) => hasCalculatorsBelow(child, index)).map((child) => districtRow(child, index, input));
  const aliases = inside.filter((child) => !hasCalculatorsBelow(child, index)).map((child) => child.title);
  const href = published.length > 0 ? input.buildHref(district.key) : undefined;

  return {
    key: district.key,
    title: district.title,
    shortTitle: district.shortTitle,
    code: district.code,
    href,
    children: children.length > 0 ? children : undefined,
    aliases: aliases.length > 0 ? aliases : undefined,
  };
}

export function districtPickerViewModel(input: DistrictPickerViewModelInput): DistrictPickerViewModel {
  const { group, election } = input;
  const index = indexDistricts(election, group);
  const districts = [...index.byKey.values()];
  const { selection } = group;

  const sections: DistrictPickerSectionViewModel[] = [];
  const topLevelRows = districts.filter((district) => !isSection(district, index) && isTopLevel(district, index)).map((district) => districtRow(district, index, input));
  if (topLevelRows.length > 0) {
    sections.push({ key: "", rows: topLevelRows });
  }
  for (const section of districts.filter((district) => isSection(district, index))) {
    const rows = (index.childrenOf.get(section.key) ?? []).filter((district) => !isSection(district, index)).map((district) => districtRow(district, index, input));
    if (rows.length > 0) {
      sections.push({ key: section.key, title: section.shortTitle ?? section.title, rows });
    }
  }

  return {
    title: selection?.title,
    description: selection?.description,
    searchPlaceholder: selection?.searchPlaceholder,
    showCode: selection?.showCode ?? false,
    sections,
  };
}
