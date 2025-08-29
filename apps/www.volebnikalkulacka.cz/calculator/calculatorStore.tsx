"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

type CalculatorStore = {
  data: any | undefined;
};

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

// update to props with children, assign questions differently?
export type CalculatorStoreProviderProps = {
  children: ReactNode;
  data: any;
};

export const CalculatorStoreProvider = ({ children, data }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<CalculatorStore>((set) => ({
      data: data,
    }));
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};

// eslint-disable-next-line no-unused-vars
export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing CalculatorStoreProvider");
  }
  return useStore(store, selector);
}

export default CalculatorStore;
