import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import type { CalculatorData } from "../../data-fetching";
import { type CalculatorStore, CalculatorStoreContext, createCalculatorStore } from "../../stores";

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
