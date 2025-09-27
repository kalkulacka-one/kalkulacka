import type { PropsWithChildren } from "react";

import { AnswersStoreProvider, CalculatorStoreProvider } from "../../calculator/components/client";
import { Layout as AppLayout } from "../../calculator/components/server";
import type { CalculatorData } from "../../calculator/lib";
import { SessionDataLoader } from "./session-data-loader";
import { SessionInitializer } from "./session-initializer";

type ProviderLayoutProps = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function ProviderLayout({ calculatorData, children }: ProviderLayoutProps) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <SessionInitializer />
        <SessionDataLoader />
        <AppLayout>{children}</AppLayout>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
