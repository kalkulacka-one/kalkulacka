import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

import type { CalculatorData } from "@kalkulacka-one/app";
import { type CalculatorStore, CalculatorStoreContext, createCalculatorStore } from "@kalkulacka-one/app/client";

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
