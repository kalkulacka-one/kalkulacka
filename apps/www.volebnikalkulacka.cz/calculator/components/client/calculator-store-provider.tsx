import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import type { CalculatorData } from "../../data-fetching";
import type { CalculatorStore } from "../../stores/calculator";
import { CalculatorStoreContext, createCalculatorStore } from "../../stores/calculator";

export type CalculatorStoreProviderProps = {
  children: ReactNode;
  calculatorData: CalculatorData;
};

export const CalculatorStoreProvider = ({ children, calculatorData }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createCalculatorStore(calculatorData);
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};
