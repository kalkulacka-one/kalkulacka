"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

// divide store, to the external file ?
type ElectionStore = {
  // eslint-disable-next-line no-unused-vars
  toggleImportant: (currentQuestion: number) => void;
  // eslint-disable-next-line no-unused-vars
  answerYes: (currentQuestion: number) => void;
  // eslint-disable-next-line no-unused-vars
  answerNo: (currentQuestion: number) => void;
  userLocation: string;
  selectedElectionType: string;
  selectedDistrict: string;
  electionIntro: any;
  questions: any;
  // safe type vars with fix values like that?
  guideStep: number;
  currentQuestion: number;

  // // electionStore actions
  // eslint-disable-next-line no-unused-vars
  setQuestions: (questions: any) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedElectionType: (electionType: string) => void;
  // eslint-disable-next-line no-unused-vars
  setSelectedDistrict: (district: any) => void;
  // eslint-disable-next-line no-unused-vars
  setElectionIntro: (electionIntro: any) => void;
  // eslint-disable-next-line no-unused-vars
  setGuideStep: (guideStep: number) => void;
  setNextGuideStep: () => void;
  setPreviousGuideStep: () => void;
  setNextQuestion: () => void;
  setPreviousQuestion: () => void;
  // eslint-disable-next-line no-unused-vars
  setUserLocation: (location: string) => void;
};

export const ElectionStoreContext = createContext<
  StoreApi<ElectionStore> | undefined
>(undefined);

// update to props with children, assign questions differently?
export interface ElectionStoreProviderProps {
  children: ReactNode;
  //   questions: ExtendedQuestions[];
}

export const ElectionStoreProvider = ({
  children,
}: ElectionStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ElectionStore> | undefined>();
  if (!storeRef.current) {
    storeRef.current = createStore<ElectionStore>((set) => ({
      userLocation: "",
      currentQuestion: 1,
      questions: [],
      selectedElectionType: "",
      guideStep: 1,
      electionIntro: "",
      selectedDistrict: "",
      // setters
      setUserLocation: (location) => set(() => ({ userLocation: location })),
      setQuestions: (questions) =>
        set(() => ({
          questions: questions,
        })),
      setSelectedDistrict: (district) =>
        set(() => ({ selectedDistrict: district })),
      setSelectedElectionType: (electionType) =>
        set(() => ({ selectedElectionType: electionType })),
      setElectionIntro: (electionIntro) =>
        set(() => ({ electionIntro: electionIntro })),
      setNextQuestion: () =>
        set((state) => ({
          currentQuestion:
            state.currentQuestion >= 1 &&
            state.currentQuestion < state.questions.length
              ? state.currentQuestion + 1
              : state.currentQuestion,
        })),
      setPreviousQuestion: () =>
        set((state) => ({
          currentQuestion:
            state.currentQuestion > 1 &&
            // good to have in case of some edge event?
            state.currentQuestion <= state.questions.length
              ? state.currentQuestion - 1
              : state.currentQuestion,
        })),
      setGuideStep: (guideStep) => set(() => ({ guideStep: guideStep })),
      setNextGuideStep: () =>
        set((state) => ({
          guideStep:
            state.guideStep >= 1 && state.guideStep < 4
              ? state.guideStep + 1
              : state.guideStep,
        })),
      setPreviousGuideStep: () =>
        set((state) => ({
          guideStep:
            state.guideStep > 4 || state.guideStep > 1
              ? state.guideStep - 1
              : state.guideStep,
        })),
      toggleImportant: (currentQuestion) =>
        set((state) => {
          const questions = storeRef.current?.getState().questions;
          const updatedQuestion = state.questions.map((question: any) => {
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
      answerYes: (currentQuestion) => {
        const questions = storeRef.current?.getState().questions;
        set((state) => {
          const updatedQuestion = state.questions.map((question: any) => {
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

        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        const userLocation = storeRef.current?.getState().userLocation;
        if (userLocation === "otazka" && answerType === true) {
          storeRef.current?.getState().setNextQuestion();
        }
      },
      answerNo: (currentQuestion) => {
        set((state) => {
          const questions = storeRef.current?.getState().questions;
          const updatedQuestion = state.questions.map((question: any) => {
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

        const answerType =
          storeRef.current?.getState().questions[currentQuestion - 1]
            ?.answerType;
        const userLocation = storeRef.current?.getState().userLocation;
        if (userLocation === "otazka" && answerType === false) {
          storeRef.current?.getState().setNextQuestion();
        }
      },
    }));
  }

  return (
    <ElectionStoreContext.Provider value={storeRef.current}>
      {children}
    </ElectionStoreContext.Provider>
  );
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

// 1. Store location better solution?
// 2. Types
// 3.
