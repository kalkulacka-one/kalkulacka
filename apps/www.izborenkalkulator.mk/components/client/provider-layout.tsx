import type { CalculatorData } from "@kalkulacka-one/app";

import type { PropsWithChildren } from "react";

import { AnswersStoreProvider } from "./answers-store-provider";
import { CalculatorStoreProvider } from "./calculator-store-provider";

export type ProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

/**
 * The stores around every calculator screen — and nothing else in the DOM.
 *
 * This used to also wrap the screens in the legacy `Layout` grid. The legacy
 * pages render that grid themselves, so for them it was a second, redundant
 * one; for the ported screens it broke the `Shell`'s `height: 100%` chain
 * from `<body>` (a grid row sized `auto` gives a percentage height nothing to
 * resolve against), which on a desktop left a reading screen taller than the
 * viewport unable to scroll — the guide's "Разбирам, почни" was simply below
 * the fold with no way down to it. The shell is now the body's direct child,
 * the way 2026 lays it out.
 */
export function ProviderLayout({ calculatorData, children }: ProviderLayout) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>{children}</AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
