import { type ReactNode, useRef } from "react";
import { createStore, type StoreApi } from "zustand";

import type { CalculatorData } from "../../lib";
import type { CalculatorStore } from "../../stores/calculator";
import { CalculatorStoreContext } from "../../stores/calculator";

export type CalculatorStoreProviderProps = {
  children: ReactNode;
  calculatorData: CalculatorData;
};

export const CalculatorStoreProvider = ({ children, calculatorData }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<CalculatorStore>(() => ({
      calculator: calculatorData,
    }));
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};
