import type { Answer } from "@repo/schema/schemas";
import { createContext, useContext } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

type AnswersStoreState = {
  answers: Answer[];
};

type AnswersStoreActions = {
  setAnswer: (answer: Partial<Answer> & { questionId: string }) => void;
  setAnswers: (answers: Answer[]) => void;
  getAnswer: (questionId: string) => Answer | undefined;
  clearAnswers: () => void;
};

export type AnswersStore = AnswersStoreState & AnswersStoreActions;

export const createAnswersStore = () => {
  return createStore<AnswersStore>((set, get) => ({
    answers: [],
    setAnswer: (answer: Partial<Answer> & { questionId: string }) => {
      set((state) => {
        const existingIndex = state.answers.findIndex((a) => a.questionId === answer.questionId);
        if (existingIndex >= 0) {
          const newAnswers = [...state.answers];
          newAnswers[existingIndex] = { ...newAnswers[existingIndex], ...answer };
          return { answers: newAnswers };
        }
        const newAnswer: Answer = { ...answer };
        return { answers: [...state.answers, newAnswer] };
      });
    },
    setAnswers: (answers: Answer[]) => {
      set({ answers });
    },
    getAnswer: (questionId: string) => {
      return get().answers.find((answer) => answer.questionId === questionId);
    },
    clearAnswers: () => {
      set({ answers: [] });
    },
  }));
};

export const AnswersStoreContext = createContext<StoreApi<AnswersStore> | undefined>(undefined);

export function useAnswersStore<U>(selector: (state: AnswersStore) => U): U {
  const store = useContext(AnswersStoreContext);
  if (!store) {
    throw new Error("Missing answers store provider");
  }
  return useStore(store, selector);
}
