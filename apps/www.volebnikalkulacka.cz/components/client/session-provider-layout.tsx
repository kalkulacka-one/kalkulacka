import type { PropsWithChildren } from "react";

import type { CalculatorData } from "@kalkulacka-one/app";

import { ProviderLayout } from "./provider-layout";
import { SessionDataLoader } from "./session-data-loader";
import { SessionInitializer } from "./session-initializer";

export type SessionProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function SessionProviderLayout({ calculatorData, children }: SessionProviderLayout) {
  return (
    <ProviderLayout calculatorData={calculatorData}>
      <SessionInitializer />
      <SessionDataLoader />
      {children}
    </ProviderLayout>
  );
}
