import type { PropsWithChildren } from "react";

import { Layout as AppLayout, type CalculatorData } from "@/calculator";
import { AnswersStoreProvider, CalculatorStoreProvider } from "@kalkulacka-one/app/client";

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
