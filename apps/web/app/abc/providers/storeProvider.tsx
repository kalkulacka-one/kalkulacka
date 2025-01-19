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

type Guide = {
  title?: string;
  region?: string;
  contentBefore?: string;
  contentAfter?: string;
}[];

// divide store, to the external file?

type Store = {
  questions: ExtendedQuestions[];
  currentQuestion: number | null;
  answerYes: (currentQuestion: number) => void;
  answerNo: (currentQuestion: number) => void;
  toggleImportant: (currentQuestion: number) => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
  nextGuide: () => void;
  prevGuide: () => void;
  // fix no unused vars error
  guideNumber: number | null;
  guide: Guide;
  isRekapitulace: boolean;
  currentLocation: "navod" | "otazka" | "rekapitulace" | null;
  setGuideNumber: (guideNumber: number) => void;
  setCurrentLocation: (
    currentLocation: "navod" | "otazka" | "rekapitulace",
  ) => void;
  setCurrentQuestion: (number: number) => void;
  setIsRekapitulace: (rekapitulaceState: boolean) => void;
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
      currentLocation: null,
      setCurrentLocation: (currentLocation) =>
        set(() => ({ currentLocation: currentLocation })),
      setIsRekapitulace: (rekapitulaceState) =>
        set(() => ({ isRekapitulace: rekapitulaceState })),
      isRekapitulace: false,
      questions,
      currentQuestion: null,
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
        // better way how to solve this?
        const isRekapitulace = storeRef.current?.getState().isRekapitulace;
        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        if (!isRekapitulace && answerType === true) {
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
        // better way how to solve this?
        const isRekapitulace = storeRef.current?.getState().isRekapitulace;
        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        if (!isRekapitulace && answerType === false) {
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
      // add edge cases
      prevQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion - 1 })),
      skipQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
      guideNumber: null,
      guide: guide,
      setGuideNumber: (guideNumber) =>
        set(() => ({ guideNumber: guideNumber })),
      prevGuide: () => set((state) => ({ guideNumber: state.guideNumber - 1 })),
      nextGuide: () => {
        set((state) => ({ guideNumber: state.guideNumber + 1 }));
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

export function useQuestionsStore<U>(selector: (state: Store) => U): U {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("Missing StoreProvider");
  }
  return useStore(store, selector);
}

// TODO:

// 1. answer toggle button interaction refinements:
// a) ANSWER EMPTY =>
//    - toggle YES or NO
//    - move to the next question
//    - "přeskočit otázku" (skip button)
// b) QUESTION ANSWERED =>
//    - possibility to untoggle
//    - do not move to the next question
//    - "další otázka" when (skip button)
