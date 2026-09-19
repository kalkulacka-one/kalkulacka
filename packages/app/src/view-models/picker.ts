import type { Calculator, CalculatorGroup, DistrictKind, Election } from "@kalkulacka-one/schema";

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
