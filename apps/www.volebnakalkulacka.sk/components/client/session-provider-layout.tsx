import type { CalculatorData } from "@kalkulacka-one/app";

import type { PropsWithChildren } from "react";

import { ProviderLayout } from "./provider-layout";
import { SessionDataLoader } from "./session-data-loader";
import { SessionInitializer } from "./session-initializer";
import { SessionStatusProvider } from "./session-status";

export type SessionProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function SessionProviderLayout({ calculatorData, children }: SessionProviderLayout) {
  return (
    <ProviderLayout calculatorData={calculatorData}>
      <SessionStatusProvider>
        <SessionInitializer />
        <SessionDataLoader />
        {children}
      </SessionStatusProvider>
    </ProviderLayout>
  );
}
