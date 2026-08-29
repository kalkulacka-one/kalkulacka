import type { PropsWithChildren } from "react";

import { AnswersStoreProvider, CalculatorStoreProvider } from "../../calculator/components/client";
import { Layout as AppLayout } from "../../calculator/components/server";
import type { CalculatorData } from "../../calculator/lib";
import { LocalStorageDataLoader } from "./local-storage-data-loader";

export type ProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function ProviderLayout({ calculatorData, children }: ProviderLayout) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <LocalStorageDataLoader />
        <AppLayout>{children}</AppLayout>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
