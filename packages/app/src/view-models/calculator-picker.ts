import type { Calculator, District, ElectionCalculatorItem } from "@kalkulacka-one/schema";

import { isPublished } from "./published";

export type CalculatorPickerCardViewModel = {
  key: string;
  title: string;
  description?: string;
  href: string;
  available: boolean;
};

export type CalculatorPickerViewModel = {
  title: string;
  cards: CalculatorPickerCardViewModel[];
};

export function calculatorPickerViewModel(
  district: District,
  items: ElectionCalculatorItem[],
  calculators: Record<string, Calculator>,
  buildHref: (key: string) => string,
  now: Date,
): CalculatorPickerViewModel {
  return {
    title: district.title,
    cards: items.map((item) => {
      const calculator = calculators[item.key];
      return {
        key: item.key,
        title: calculator?.title ?? calculator?.shortTitle ?? item.key,
        description: calculator?.description,
        href: buildHref(item.key),
        available: isPublished(calculator, now),
      };
    }),
  };
}
