import { createContext, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import type { CalculatorData } from "../lib";

export type CalculatorStore = CalculatorData;

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing calculator store provider");
  }
  return useStore(store, selector);
}
