import { type ReactNode, useRef } from "react";
import { createStore, type StoreApi } from "zustand";

import type { CalculatorData } from "../../lib";
import type { CalculatorStore } from "../../stores/calculator";
import { CalculatorStoreContext } from "../../stores/calculator";

export type CalculatorStoreProviderProps = {
  children: ReactNode;
  calculatorData: CalculatorData;
};

export const CalculatorStoreProvider = ({ children, calculatorData }: CalculatorStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CalculatorStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<CalculatorStore>((set, get) => ({
      ...calculatorData,
      currentQuestionIndex: 0,
      answers: new Map(),
      setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId: string, answer: boolean | null) => {
        const current = get().answers.get(questionId) || { isImportant: false };
        const newAnswers = new Map(get().answers);
        newAnswers.set(questionId, { ...current, answer });
        set({ answers: newAnswers });
      },
      setImportant: (questionId: string, isImportant: boolean) => {
        const current = get().answers.get(questionId) || { answer: undefined };
        const newAnswers = new Map(get().answers);
        newAnswers.set(questionId, { ...current, isImportant });
        set({ answers: newAnswers });
      },
      getAnswer: (questionId: string) => get().answers.get(questionId),
      isQuestionAnswered: (questionId: string) => {
        const answer = get().answers.get(questionId);
        return answer?.answer !== undefined;
      },
      isQuestionImportant: (questionId: string) => {
        const answer = get().answers.get(questionId);
        return answer?.isImportant === true;
      },
    }));
  }

  return <CalculatorStoreContext.Provider value={storeRef.current}>{children}</CalculatorStoreContext.Provider>;
};
