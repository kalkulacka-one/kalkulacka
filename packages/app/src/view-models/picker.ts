import type { Calculator, CalculatorGroup, District, DistrictKind, Election, ElectionCalculatorItem } from "@kalkulacka-one/schema";

import { isPublished } from "./published";

export type PickerCopy = {
  title: string;
  description?: string;
  searchPlaceholder: string;
};

export type PickerRowViewModel = {
  key: string;
  title: string;
  shortTitle?: string;
  code?: string;
  kind: DistrictKind;
  href?: string;
  available: boolean;
  children?: PickerRowViewModel[];
  aliases?: string[];
};

export type PickerSectionViewModel = {
  key: string;
  title?: string;
  rows: PickerRowViewModel[];
};

export type PickerViewModel = PickerCopy & {
  kind: DistrictKind;
  showCode: boolean;
  sections: PickerSectionViewModel[];
};

export type PickerViewModelInput = {
  group: CalculatorGroup;
  election: Election;
  kind: DistrictKind;
  copy: PickerCopy;
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

function districtRow(district: District, index: DistrictIndex, input: PickerViewModelInput): PickerRowViewModel {
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
