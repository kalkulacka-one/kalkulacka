import type { PropsWithChildren } from "react";

import { AnswersStoreProvider, CalculatorStoreProvider } from "../../calculator/components/client";
import { Layout as AppLayout } from "../../calculator/components/server";
import type { CalculatorData } from "../../calculator/lib";
import { SessionContextProvider } from "./session-context-provider";

export type ProviderLayout = PropsWithChildren<{
  calculatorData: CalculatorData;
  sessionId?: string;
}>;

export function ProviderLayout({ calculatorData, sessionId, children }: ProviderLayout) {
  return (
    <SessionContextProvider sessionId={sessionId}>
      <CalculatorStoreProvider calculatorData={calculatorData}>
        <AnswersStoreProvider>
          <AppLayout>{children}</AppLayout>
        </AnswersStoreProvider>
      </CalculatorStoreProvider>
    </SessionContextProvider>
  );
}
