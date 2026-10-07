import type { CalculatorData } from "@kalkulacka-one/app";
import { Layout as AppLayout } from "@kalkulacka-one/app";
import { AnswersStoreProvider, CalculatorStoreProvider, LauncherProvider } from "@kalkulacka-one/app/client";

import type { PropsWithChildren } from "react";

import { parsedParams } from "@/lib/routing";

export type ProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function ProviderLayout({ calculatorData, children }: ProviderLayout) {
  return (
    <CalculatorStoreProvider calculatorData={calculatorData}>
      <AnswersStoreProvider>
        <LauncherProvider parse={parsedParams.launcher}>
          <AppLayout>{children}</AppLayout>
        </LauncherProvider>
      </AnswersStoreProvider>
    </CalculatorStoreProvider>
  );
}
