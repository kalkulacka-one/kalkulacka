"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import type { Calculator } from "../../../packages/schema/schemas/calculator.schema";
import type { CandidatesAnswers } from "../../../packages/schema/schemas/candidates-answers.schema";
import type { Candidates } from "../../../packages/schema/schemas/candidates.schema";
import type { Organizations } from "../../../packages/schema/schemas/organizations.schema";
import type { Persons } from "../../../packages/schema/schemas/persons.schema";
import type { Questions } from "../../../packages/schema/schemas/questions.schema";

export type CalculatorData = {
  calculator: Calculator;
  questions: Questions;
  persons: Persons;
  organizations: Organizations;
  candidates: Candidates;
  candidatesAnswers: CandidatesAnswers;
};

type CalculatorStoreState = {
  calculator: CalculatorData | undefined;
  step: number;
};

type CalculatorStoreActions = {
  actions: {
    // use args or specific action e.g. nextStep()...
    handleStep: (handleType: "next" | "previous") => void;
  };
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
      step: 1,
      actions: {
        handleStep: (handleType: string) => {
          set((state) => {
            switch (handleType) {
              case "next": {
                return { step: state.step + 1 };
              }
              case "previous": {
                return { step: state.step - 1 };
              }
            }
            return {};
          });
        },
      },
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
