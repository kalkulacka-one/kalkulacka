import type { CalculatorData } from "@kalkulacka-one/app";

import type { PropsWithChildren } from "react";

import { Layout as AppLayout } from "@/calculator";
import { AnswersStoreProvider, CalculatorStoreProvider } from "@/calculator/client";

export type ProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function ProviderLayout({ calculatorData, children }: ProviderLayout) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <AppLayout>{children}</AppLayout>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
