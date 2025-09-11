import type { PropsWithChildren } from "react";

import { AnswersStoreProvider, CalculatorStoreProvider } from "../../calculator/components/client";
import { Layout as AppLayout } from "../../calculator/components/server";
import type { CalculatorData } from "../../calculator/lib";

type ProviderLayoutProps = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function ProviderLayout({ calculatorData, children }: ProviderLayoutProps) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <AppLayout>{children}</AppLayout>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
