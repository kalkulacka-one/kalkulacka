import { createContext, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import type { CalculatorData } from "../lib";

type CalculatorStoreState = {
  calculator: CalculatorData;
};

// biome-ignore lint/complexity/noBannedTypes: To be defined
type CalculatorStoreActions = {};

type CalculatorStore = CalculatorStoreState & CalculatorStoreActions;

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing CalculatorStoreProvider");
  }
  return useStore(store, selector);
}

export default CalculatorStore;
