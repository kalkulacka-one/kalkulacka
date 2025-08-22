"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import type { Answers } from "../../../../packages/schema/schemas/answers.schema";
import type { Questions } from "../../../../packages/schema/schemas/questions.schema";

type ElectionStore = {
  calculator: any;
  setCalculator: (calculator: any) => void;
  guideStep: number;
  handleGuideStep: (handleType: string) => void;
  questions: Questions | undefined;
  setQuestions: (questions: Questions) => void;
  questionStep: number;
  maxQuestionStep: number | undefined;
  handleQuestionStep: (handleType: string) => void;
  answers: Answers | undefined;
  setAnswers: () => void;
  handleAnswer: (questionId: string, handleType: "yes" | "no" | "important") => void;
  candidatesAnswers: any;
  setCandidatesAnswers: (candidatesAnswers: any) => void;
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
      setQuestions: (questions) => set(() => ({ questions: questions })),
      questionStep: 1,
      // TODO: handle better
      maxQuestionStep: 5,
      handleQuestionStep: (handleType) => {
        const questionStep = storeRef.current?.getState().questionStep ?? 1;
        const maxQuestionStep = storeRef.current?.getState().maxQuestionStep ?? 0;
        switch (handleType) {
          case "next":
            if (questionStep > 0 && questionStep < maxQuestionStep) {
              set((state) => ({ questionStep: state.questionStep + 1 }));
            }
            break;
          case "previous":
            if (questionStep !== 1) {
              set((state) => ({ questionStep: state.questionStep - 1 }));
            }
            break;
          default:
            break;
        }
      },
      setAnswers: () => {
        const storeQuestions = storeRef.current?.getState().questions;

        if (storeQuestions) {
          const defaultAnswers = storeQuestions.map((answer) => {
            return { questionId: answer.id, answer: null, isImportant: false };
          });
          set(() => ({ answers: defaultAnswers }));
        }
      },
      answers: undefined,
      handleAnswer: (questionId, handleType) => {
        const questionStep = storeRef.current?.getState().questionStep ?? 1;
        const maxQuestionStep = storeRef.current?.getState().maxQuestionStep ?? 0;
        set((state) => {
          const newAnswers = state.answers?.map((answer) => {
            if (answer.questionId === questionId) {
              switch (handleType) {
                case "yes":
                  // TODO: handle better
                  if ((answer.answer === null || answer.answer === false) && maxQuestionStep !== questionStep) {
                    set((state) => ({ questionStep: state.questionStep + 1 }));
                  }
                  return { ...answer, answer: answer.answer === true ? null : true };
                case "no":
                  // TODO: handle better
                  if ((answer.answer === null || answer.answer === true) && maxQuestionStep !== questionStep) {
                    set((state) => ({ questionStep: state.questionStep + 1 }));
                  }
                  return { ...answer, answer: answer.answer === false ? null : false };
                case "important":
                  return { ...answer, isImportant: !answer.isImportant };
              }
            }
            return answer;
          });
          return { answers: newAnswers };
        });
      },
      candidatesAnswers: undefined,
      setCandidatesAnswers: (candidatesAnswers) => set(() => ({ candidatesAnswers: candidatesAnswers })),
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
