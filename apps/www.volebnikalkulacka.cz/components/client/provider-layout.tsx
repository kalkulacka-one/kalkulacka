import type { PropsWithChildren } from "react";

import { AnswersStoreProvider, CalculatorStoreProvider } from "@/calculator/components/client";
import { Layout as AppLayout } from "@/calculator/components/server";
import type { CalculatorData } from "@/calculator/data-fetching";

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
