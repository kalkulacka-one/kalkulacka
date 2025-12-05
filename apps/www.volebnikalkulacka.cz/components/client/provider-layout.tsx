import { AnswersStoreProvider, CalculatorStoreProvider } from "@kalkulacka-one/app/client";
import { Layout as AppLayout, type CalculatorData } from "@kalkulacka-one/app/server";

import type { PropsWithChildren } from "react";

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
