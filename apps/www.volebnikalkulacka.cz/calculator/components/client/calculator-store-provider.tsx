import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import type { CalculatorData } from "@/calculator/data-fetching";
import type { CalculatorStore } from "@/calculator/stores";
import { CalculatorStoreContext, createCalculatorStore } from "@/calculator/stores";

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
