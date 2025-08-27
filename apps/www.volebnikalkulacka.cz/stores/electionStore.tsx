"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, createStore, useStore } from "zustand";

type ElectionStore = {
  election: any;
  setElection: (electionData: any) => void;
  // TODO: CalculatorShape
  calculator: any | undefined;
  // TODO: Shape and data check
  setCalculator: (calculatorData: any) => void;
  // TODO. Shape, userAnswers
  answers: any | undefined;
  setAnswers: () => void;
  questionStep: number;
  setQuestionStep: (questionStep: number) => void;
  handleAnswer: (questionId: string, handleType: "yes" | "no" | "important", storeLocation?: "otazka" | undefined) => void;
  handleQuestionStep: (handleType: string) => void;
  guideStep: number;
  handleGuideStep: (handleType: string) => void;
  setGuideStep: (guideStep: number) => void;
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
      election: undefined,
      setElection: (electionData) => set({ election: electionData }),
      calculator: undefined,
      setCalculator: (calculatorData) =>
        set({
          calculator: {
            calculator: calculatorData[0],
            candidatesAnswers: calculatorData[1],
            candidates: calculatorData[2],
            organizations: calculatorData[3],
            persons: calculatorData[4],
            questions: calculatorData[5],
          },
        }),
      answers: undefined,
      setAnswers: () =>
        set((state) => {
          const storeQuestions = state.calculator.questions;
          if (storeQuestions) {
            const answersFromQuestions = storeQuestions.map((question: any) => {
              return { questionId: question.id, answer: null, isImportant: false };
            });
            return { answers: answersFromQuestions };
          }
          return {};
        }),
      questionStep: 1,
      setQuestionStep: (questionStep) => set(() => ({ questionStep: questionStep })),
      handleAnswer: (questionId, handleType, storeLocation) => {
        set((state) => {
          const questionStep = state.questionStep;
          const maxQuestionStep = state.calculator.questions.length;
          const oldAnswer = state.answers?.find((answer) => answer.questionId === questionId);
          const newAnswers = state.answers?.map((answer) => {
            if (answer.questionId === questionId) {
              switch (handleType) {
                case "yes":
                  return { ...answer, answer: answer.answer === true ? null : true };
                case "no":
                  return { ...answer, answer: answer.answer === false ? null : false };
                case "important":
                  return { ...answer, isImportant: !answer.isImportant };
              }
            }
            return answer;
          });
          // handle questionStep forward logic
          let nextQuestionStep = questionStep;
          if (storeLocation === "otazka" && maxQuestionStep !== questionStep) {
            if (handleType === "yes" && (oldAnswer?.answer === null || oldAnswer?.answer === false)) {
              nextQuestionStep = questionStep + 1;
            } else if (handleType === "no" && (oldAnswer?.answer === null || oldAnswer?.answer === true)) {
              nextQuestionStep = questionStep + 1;
            }
          }
          return { ...state, answers: newAnswers, questionStep: nextQuestionStep };
        });
      },
      handleQuestionStep: (handleType) => {
        set((state) => {
          const questionStep = state.questionStep;
          const maxQuestionStep = state.calculator.questions.length;
          switch (handleType) {
            case "next":
              if (questionStep > 0 && questionStep < maxQuestionStep) {
                return { questionStep: state.questionStep + 1 };
              }
              break;
            case "previous":
              if (questionStep !== 1) {
                return { questionStep: state.questionStep - 1 };
              }
              break;
            default:
          }
          return {};
        });
      },
      guideStep: 1,
      handleGuideStep: (handleType) => {
        set((state) => {
          if (handleType === "next") {
            return { guideStep: state.guideStep + 1 };
          }
          if (handleType === "previous") {
            return { guideStep: state.guideStep - 1 };
          }
          return {};
        });
      },
      setGuideStep: (guideStep) => set(() => ({ guideStep: guideStep })),
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
