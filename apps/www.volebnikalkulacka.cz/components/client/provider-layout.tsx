import { AnswersStoreProvider, CalculatorStoreProvider } from "@kalkulacka-one/app/components/client";
import { Layout as AppLayout } from "@kalkulacka-one/app/components/server/components";
import type { CalculatorData } from "@kalkulacka-one/app/data-fetching";

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
