import type { PropsWithChildren } from "react";

import type { CalculatorData } from "../../calculator/lib";
import { ProviderLayout } from "./provider-layout";
import { SessionDataLoader } from "./session-data-loader";
import { SessionInitializer } from "./session-initializer";

export type SessionProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
  sessionId?: string;
}>;

export function SessionProviderLayout({ calculatorData, sessionId, children }: SessionProviderLayout) {
  return (
    <ProviderLayout calculatorData={calculatorData} sessionId={sessionId}>
      <SessionInitializer />
      <SessionDataLoader />
      {children}
    </ProviderLayout>
  );
}
