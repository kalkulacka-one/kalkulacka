"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

type Store = {
  count: number;
  questions: string[];
  currentQuestion: number;
  collection: string[];
  decrementCount: () => void;
  incrementCount: () => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
};

export const StoreContext = createContext<StoreApi<Store> | undefined>(
  undefined,
);

// update to props with children
export interface StoreProviderProps {
  children: ReactNode;
  collection: string[];
}

export const StoreProvider = ({ children, collection }: StoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store> | undefined>();
  if (!storeRef.current) {
    storeRef.current = createStore<Store>((set) => ({
      collection,
      count: 1,
      questions: ["Item 1", "Item 2", "Item 3"],
      currentQuestion: 1,
      decrementCount: () => set((state) => ({ count: state.count - 1 })),
      incrementCount: () => set((state) => ({ count: state.count + 1 })),
      prevQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion - 1 })),
      skipQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
    }));
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export function useQuestionsStore<U>(selector: (state: Store) => U): U {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
}
