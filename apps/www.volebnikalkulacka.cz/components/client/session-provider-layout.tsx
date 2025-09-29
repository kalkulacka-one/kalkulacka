import type { PropsWithChildren } from "react";

import type { CalculatorData } from "../../calculator/lib";
import { ProviderLayout } from "./provider-layout";
import { SessionDataLoader } from "./session-data-loader";
import { SessionInitializer } from "./session-initializer";

type SessionProviderLayoutProps = PropsWithChildren<{
  calculatorData: CalculatorData;
}>;

export function SessionProviderLayout({ calculatorData, children }: SessionProviderLayoutProps) {
  return (
    <ProviderLayout calculatorData={calculatorData}>
      <SessionInitializer />
      <SessionDataLoader />
      {children}
    </ProviderLayout>
  );
}
