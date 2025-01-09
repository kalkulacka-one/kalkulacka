"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

// divide store, to the external file?

type Store = {
  questions: string[];
  currentQuestion: number;
  prevQuestion: () => void;
  skipQuestion: () => void;
  nextGuide: () => void;
  prevGuide: () => void;
  guideNumber: number;
  guideContent: string[];
};

export const StoreContext = createContext<StoreApi<Store> | undefined>(
  undefined,
);

// update to props with children
export interface StoreProviderProps {
  children: ReactNode;
  questions: string[];
}

export const StoreProvider = ({ children, questions }: StoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store> | undefined>();
  if (!storeRef.current) {
    storeRef.current = createStore<Store>((set) => ({
      questions,
      currentQuestion: 1,
      prevQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion - 1 })),
      skipQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
      guideNumber: 1,
      guideContent: ["Guide item 1", "Guide item 2", "Guide item 3"],
      prevGuide: () => set((state) => ({ guideNumber: state.guideNumber - 1 })),
      nextGuide: () => set((state) => ({ guideNumber: state.guideNumber + 1 })),
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
