"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

import type { CalculatorData } from "../common";

type CalculatorStoreState = {
  calculator: CalculatorData | undefined;
  step: number | undefined;
};

type CalculatorStoreActions = {
  setStep: (step: number) => void;
};

type CalculatorStore = CalculatorStoreState & CalculatorStoreActions;

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export type CalculatorStoreProviderProps = {
  children: ReactNode;
  calculatorData: CalculatorData;
};

export const CalculatorStoreProvider = ({ children, calculatorData }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<CalculatorStore>((set) => ({
      calculator: calculatorData,
      step: undefined,
      setStep: (step) => set(() => ({ step: step })),
    }));
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing CalculatorStoreProvider");
  }
  return useStore(store, selector);
}

export default CalculatorStore;
