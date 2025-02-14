"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import guide from "../navod/guide.json";
import type { ExtendedQuestions, Guide } from "./store.types";

// divide store, to the external file ?
type Store = {
  questions: ExtendedQuestions[];
  currentQuestion: number;
  currentGuide: number;
  // eslint-disable-next-line no-unused-vars
  answerYes: (currentQuestion: number) => void;
  // eslint-disable-next-line no-unused-vars
  answerNo: (currentQuestion: number) => void;
  // eslint-disable-next-line no-unused-vars
  toggleImportant: (currentQuestion: number) => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
  nextGuide: () => void;
  prevGuide: () => void;
  // fix no unused vars error
  guide: Guide;
  currentLocation: "navod" | "otazka" | "rekapitulace" | "vysledky" | "default";
  // eslint-disable-next-line no-unused-vars
  setCurrentGuide: (currentGuide: number) => void;
  setCurrentLocation: (
    // eslint-disable-next-line no-unused-vars
    currentLocation:
      | "navod"
      | "otazka"
      | "rekapitulace"
      | "vysledky"
      | "default",
  ) => void;
  // eslint-disable-next-line no-unused-vars
  setCurrentQuestion: (number: number) => void;
  // eslint-disable-next-line no-unused-vars
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
      currentLocation: "default",
      setCurrentLocation: (currentLocation) =>
        set(() => ({ currentLocation: currentLocation })),
      questions,
      currentQuestion: 0,
      answerYes: (currentQuestion) => {
        set((state) => {
          const updatedQuestion = state.questions.map((question) => {
            if (
              (questions[currentQuestion - 1]?.id === question.id &&
                question.answerType === null) ||
              (questions[currentQuestion - 1]?.id === question.id &&
                question.answerType === false)
            ) {
              return {
                ...question,
                answerType: true,
              };
            } else if (
              questions[currentQuestion - 1]?.id === question.id &&
              question.answerType === true
            ) {
              return {
                ...question,
                answerType: null,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestion };
        });
        // understand this function  with current invoke better
        // possible better way how to solve this?
        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        const storeLocation = storeRef.current?.getState().currentLocation;
        if (storeLocation === "otazka" && answerType === true) {
          storeRef.current?.getState().skipQuestion();
        }
      },
      answerNo: (currentQuestion) => {
        set((state) => {
          const updatedQuestion = state.questions.map((question) => {
            if (
              (questions[currentQuestion - 1]?.id === question.id &&
                question.answerType === null) ||
              (questions[currentQuestion - 1]?.id === question.id &&
                question.answerType === true)
            ) {
              return {
                ...question,
                answerType: false,
              };
            } else if (
              questions[currentQuestion - 1]?.id === question.id &&
              question.answerType === false
            ) {
              return {
                ...question,
                answerType: null,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestion };
        });
        // understand this function  with current invoke better
        // possible better way how to solve this?
        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        const storeLocation = storeRef.current?.getState().currentLocation;
        if (storeLocation === "otazka" && answerType === false) {
          storeRef.current?.getState().skipQuestion();
        }
      },
      toggleImportant: (currentQuestion) =>
        set((state) => {
          const updatedQuestion = state.questions.map((question) => {
            if (questions[currentQuestion - 1]?.id === question.id) {
              return {
                ...question,
                isImportant: !question.isImportant,
              };
            }
            return { ...question };
          });
          return { ...state, questions: updatedQuestion };
        }),
      // TODO: check edge cases
      prevQuestion: () =>
        set((state) => ({
          currentQuestion:
            state.currentQuestion > 0
              ? state.currentQuestion - 1
              : state.currentQuestion,
        })),
      skipQuestion: () =>
        set((state) => ({
          currentQuestion:
            state.currentQuestion < questions.length
              ? state.currentQuestion + 1
              : state.currentQuestion,
        })),
      currentGuide: 0,
      guide: guide,
      setCurrentGuide: (currentGuide) =>
        set(() => ({ currentGuide: currentGuide })),
      prevGuide: () =>
        set((state) => ({
          currentGuide:
            state.currentGuide > 0
              ? state.currentGuide - 1
              : state.currentGuide,
        })),
      nextGuide: () => {
        set((state) => ({
          currentGuide:
            state.currentGuide < guide.length
              ? state.currentGuide + 1
              : state.currentGuide,
        }));
      },
      setCurrentQuestion: (number) => set(() => ({ currentQuestion: number })),
    }));
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

// eslint-disable-next-line no-unused-vars
export function useQuestionsStore<U>(selector: (state: Store) => U): U {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
}

export default Store;
