import { createContext, useContext } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

import type { CalculatorData } from "@/data-fetching";

export type CalculatorStore = CalculatorData;

export const createCalculatorStore = (calculatorData: CalculatorData) => {
  return createStore<CalculatorStore>(() => calculatorData);
};

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing calculator store provider");
  }
  return useStore(store, selector);
}
