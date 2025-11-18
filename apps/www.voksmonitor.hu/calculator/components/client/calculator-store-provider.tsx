import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import { getRuntimeSessionId } from "../../../lib/session/runtime-session";
import type { CalculatorData } from "../../lib";
import type { CalculatorStore } from "../../stores/calculator";
import { CalculatorStoreContext, createCalculatorStore } from "../../stores/calculator";

export type CalculatorStoreProviderProps = {
  children: ReactNode;
  calculatorData: CalculatorData;
};

export const CalculatorStoreProvider = ({ children, calculatorData }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    const sessionId = getRuntimeSessionId();
    storeRef.current = createCalculatorStore(calculatorData, sessionId);
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};
