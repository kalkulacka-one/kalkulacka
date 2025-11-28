import type { CalculatorData } from "@kalkulacka-one/app/data-fetching";
import type { CalculatorStore } from "@kalkulacka-one/app/stores";
import { CalculatorStoreContext, createCalculatorStore } from "@kalkulacka-one/app/stores";

import { type ReactNode, useRef } from "react";
import type { StoreApi } from "zustand";

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
