"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import { Question } from "@repo/schema/dist";
import guide from "../navod/guide.json";

// extend question type like this? (need isImportant, answerType)

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

type Guide = { contentBefore?: string; contentAfter?: string }[];

// divide store, to the external file?

type Store = {
  questions: ExtendedQuestions[];
  currentQuestion: number;
  prevQuestion: () => void;
  skipQuestion: () => void;
  nextGuide: () => void;
  prevGuide: () => void;
  toggleImportant: () => void;
  answerYes: () => void;
  answerNo: () => void;
  // fix no unused vars error
  toggleYes: (cardId: string) => void;
  toggleNo: (cardId: string) => void;
  toggleImportantRec: (cardId: string) => void;
  setCurrentQuestion: (number: number) => void;
  guideNumber: number;
  guide: Guide;
};

export const StoreContext = createContext<StoreApi<Store> | undefined>(
  undefined,
);

// update to props with children, assign questions differently?
export interface StoreProviderProps {
  children: ReactNode;
  questions: ExtendedQuestions[];
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
      nextGuide: () => {
        set((state) => ({ guideNumber: state.guideNumber + 1 }));
      },
      toggleImportant: () =>
        set((state) => {
          const updatedQuestions = state.questions.map((question, index) => {
            if (index + 1 === state.currentQuestion) {
              return {
                ...question,
                isImportant: !question.isImportant,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
      answerYes: () =>
        set((state) => {
          const updatedQuestions = state.questions.map((question, index) => {
            if (index + 1 === state.currentQuestion) {
              return {
                ...question,
                answerType: true,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
      answerNo: () =>
        set((state) => {
          const updatedQuestions = state.questions.map((question, index) => {
            if (index + 1 === state.currentQuestion) {
              return {
                ...question,
                answerType: false,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
      setCurrentQuestion: (number) => set(() => ({ currentQuestion: number })),
      toggleYes: (cardId) =>
        set((state) => {
          const updatedQuestions = state.questions.map((question) => {
            if (cardId === question.id) {
              return {
                ...question,
                answerType: true,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
      toggleNo: (cardId) =>
        set((state) => {
          const updatedQuestions = state.questions.map((question) => {
            if (cardId === question.id) {
              return {
                ...question,
                answerType: false,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
      toggleImportantRec: (cardId) =>
        set((state) => {
          const updatedQuestions = state.questions.map((question) => {
            if (cardId === question.id) {
              return {
                ...question,
                isImportant: !question.isImportant,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestions };
        }),
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
