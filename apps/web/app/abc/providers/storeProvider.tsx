"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import { Question } from "@repo/schema/dist";
import guide from "../navod/guide.json";

// extend question type like this? (need isImportant, answerType)

// type ExtendedQuestions = Question & {
//   isImportant: true | false | null;
//   answerType: true | false | null;
// };

// divide store, to the external file?

type Store = {
  questions: Question[];
  currentQuestion: number;
  prevQuestion: () => void;
  skipQuestion: () => void;
  nextGuide: () => void;
  prevGuide: () => void;
  guideNumber: number;
  guide: { message: string }[];
};

export const StoreContext = createContext<StoreApi<Store> | undefined>(
  undefined,
);

// update to props with children, assign questions differently?
export interface StoreProviderProps {
  children: ReactNode;
  questions: Question[];
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
      guide: guide,
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
