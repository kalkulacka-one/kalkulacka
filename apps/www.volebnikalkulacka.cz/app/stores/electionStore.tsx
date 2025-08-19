"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

type ElectionStore = {
  calculator: any;
  setCalculator: (calculator: any) => void;
  guideStep: number;
  handleGuideStep: (handleType: string) => void;
  questions: any;
  setQuestions: (questions: any) => void;
  questionStep: number;
  handleQuestionStep: (handleType: string) => void;
  answers: any[];
  setAnswers: () => void;
  handleAnswer: (questionId: string, handleType: "yes" | "no" | "important") => void;
};

export const ElectionStoreContext = createContext<StoreApi<ElectionStore> | undefined>(undefined);

// update to props with children, assign questions differently?
export type ElectionStoreProviderProps = {
  children: ReactNode;
};

export const ElectionStoreProvider = ({ children }: ElectionStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ElectionStore> | undefined>(undefined);
  if (!storeRef.current) {
    storeRef.current = createStore<ElectionStore>((set) => ({
      calculator: undefined,
      setCalculator: (calculator) => set(() => ({ calculator: calculator })),
      guideStep: 1,
      handleGuideStep: (handleType) => {
        if (handleType === "next") {
          set((state) => ({ guideStep: state.guideStep + 1 }));
        }
        if (handleType === "previous") {
          set((state) => ({ guideStep: state.guideStep - 1 }));
        }
      },
      questions: undefined,
      setQuestions: (questions) => {
        const newAnswers = questions.map((question: any) => {
          return { id: question.id, answerType: 3, isImportant: false };
        });
        set(() => ({ questions: questions, answers: newAnswers }));
      },
      questionStep: 1,
      handleQuestionStep: (handleType) => {
        if (handleType === "next") {
          set((state) => ({ questionStep: state.questionStep + 1 }));
        }
        if (handleType === "previous") {
          set((state) => ({ questionStep: state.questionStep - 1 }));
        }
      },
      setAnswers: () => {
        const storeQuestions = storeRef.current?.getState().questions;

        if (storeQuestions) {
          const defaultAnswers = storeQuestions.map((answer) => {
            return { id: answer.id, answerType: 3, isImportant: false };
          });
          set(() => ({ answers: defaultAnswers }));
        }
      },
      answers: [],
      handleAnswer: (questionId, handleType) => {
        set((state) => {
          const newAnswers = state.answers.map((answer) => {
            if (answer.id === questionId) {
              if (handleType === "yes") {
                return { ...answer, answerType: answer.answerType === 1 ? 3 : 1 };
              }
              if (handleType === "no") {
                return { ...answer, answerType: answer.answerType === 2 ? 3 : 2 };
              }
              if (handleType === "important") {
                return { ...answer, isImportant: !answer.isImportant };
              }
            }
            return answer;
          });
          return { answers: newAnswers };
        });
      },
    }));
  }

  return <ElectionStoreContext.Provider value={storeRef.current}>{children}</ElectionStoreContext.Provider>;
};

// eslint-disable-next-line no-unused-vars
export function useElectionStore<U>(selector: (state: ElectionStore) => U): U {
  const store = useContext(ElectionStoreContext);
  if (!store) {
    throw new Error("Missing ElectionStoreProvider");
  }
  return useStore(store, selector);
}

export default ElectionStore;
