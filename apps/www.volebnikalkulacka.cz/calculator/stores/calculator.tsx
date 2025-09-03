import { createContext, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { CalculatorData } from "../lib";

type CalculatorStoreState = CalculatorData & {
  currentQuestionIndex: number;
  answers: Map<string, Pick<Answer, "answer" | "isImportant">>;
};

type CalculatorStoreActions = {
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: boolean | null) => void;
  setImportant: (questionId: string, isImportant: boolean) => void;
  getAnswer: (questionId: string) => Pick<Answer, "answer" | "isImportant"> | undefined;
  isQuestionAnswered: (questionId: string) => boolean;
  isQuestionImportant: (questionId: string) => boolean;
};

export type CalculatorStore = CalculatorStoreState & CalculatorStoreActions;

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing CalculatorStoreProvider");
  }
  return useStore(store, selector);
}
