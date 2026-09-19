import type { Calculator, CalculatorGroup, District, DistrictKind, Election, ElectionCalculatorItem } from "@kalkulacka-one/schema";

import { isPublished } from "./published";

export type DistrictPickerCopy = {
  title: string;
  description?: string;
  searchPlaceholder: string;
};

export type DistrictPickerRowViewModel = {
  key: string;
  title: string;
  shortTitle?: string;
  code?: string;
  kind: DistrictKind;
  href?: string;
  available: boolean;
  children?: DistrictPickerRowViewModel[];
  aliases?: string[];
};

export type DistrictPickerSectionViewModel = {
  key: string;
  title?: string;
  rows: DistrictPickerRowViewModel[];
};

export type DistrictPickerViewModel = DistrictPickerCopy & {
  kind: DistrictKind;
  showCode: boolean;
  sections: DistrictPickerSectionViewModel[];
};

export type DistrictPickerViewModelInput = {
  group: CalculatorGroup;
  election: Election;
  kind: DistrictKind;
  copy: DistrictPickerCopy;
  buildDistrictHref: (districtKey: string) => string;
  calculators: Record<string, Pick<Calculator, "publishedAt">>;
  now: Date;
};

type DistrictIndex = {
  byKey: Map<string, District>;
  childrenOf: Map<string, District[]>;
  calculatorsOf: Map<string, ElectionCalculatorItem[]>;
};

function calculatorsByDistrict(group: CalculatorGroup): Map<string, ElectionCalculatorItem[]> {
  const byDistrict = new Map<string, ElectionCalculatorItem[]>();
  for (const item of group.calculators) {
    if (!("district" in item) || !item.district) continue;
    const items = byDistrict.get(item.district.key) ?? [];
    items.push(item);
    byDistrict.set(item.district.key, items);
  }
  return byDistrict;
}

function indexDistricts(election: Election, group: CalculatorGroup): DistrictIndex {
  const districts = election.districts ?? [];
  const byKey = new Map(districts.map((district) => [district.key, district]));
  const childrenOf = new Map<string, District[]>();
  for (const district of districts) {
    if (district.parent === undefined || !byKey.has(district.parent)) continue;
    const siblings = childrenOf.get(district.parent) ?? [];
    siblings.push(district);
    childrenOf.set(district.parent, siblings);
  }
  return { byKey, childrenOf, calculatorsOf: calculatorsByDistrict(group) };
}

function isSection(district: District, index: DistrictIndex): boolean {
  return !index.calculatorsOf.has(district.key) && (index.childrenOf.get(district.key)?.length ?? 0) > 0;
}

function isTopLevel(district: District, index: DistrictIndex): boolean {
  return district.parent === undefined || !index.byKey.has(district.parent);
}

function districtRow(district: District, index: DistrictIndex, input: DistrictPickerViewModelInput): DistrictPickerRowViewModel {
  const published = (index.calculatorsOf.get(district.key) ?? []).filter((item) => isPublished(input.calculators[item.key], input.now));
  const inside = index.childrenOf.get(district.key) ?? [];
  const children = inside.filter((child) => index.calculatorsOf.has(child.key)).map((child) => districtRow(child, index, input));
  const aliases = inside.filter((child) => !index.calculatorsOf.has(child.key)).map((child) => child.title);
  const href = published.length > 0 ? input.buildDistrictHref(district.key) : undefined;
  const available = href !== undefined || children.some((child) => child.available);

  return {
    key: district.key,
    title: district.title,
    shortTitle: district.shortTitle,
    code: district.code,
    kind: district.kind,
    href,
    available,
    children: children.length > 0 ? children : undefined,
    aliases: aliases.length > 0 ? aliases : undefined,
  };
}

export function districtPickerViewModel(input: DistrictPickerViewModelInput): DistrictPickerViewModel {
  const { group, election, kind, copy } = input;
  const districts = election.districts ?? [];
  const index = indexDistricts(election, group);
  const selection = "selection" in group ? group.selection : undefined;

  const sections: DistrictPickerSectionViewModel[] = [];
  const topLevelRows = districts.filter((district) => !isSection(district, index) && isTopLevel(district, index)).map((district) => districtRow(district, index, input));
  if (topLevelRows.length > 0) {
    sections.push({ key: "top-level", rows: topLevelRows });
  }
  for (const section of districts.filter((district) => isSection(district, index))) {
    const rows = (index.childrenOf.get(section.key) ?? []).filter((district) => !isSection(district, index)).map((district) => districtRow(district, index, input));
    if (rows.length > 0) {
      sections.push({ key: section.key, title: section.shortTitle ?? section.title, rows });
    }
  }

  return {
    title: selection?.title ?? copy.title,
    description: selection?.description ?? copy.description,
    searchPlaceholder: selection?.searchPlaceholder ?? copy.searchPlaceholder,
    showCode: selection?.showCode ?? kind === "electoral-district",
    kind,
    sections,
  };
}
