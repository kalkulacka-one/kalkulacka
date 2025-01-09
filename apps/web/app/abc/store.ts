import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  questions: string[];
  currentQuestion: number;
  collection: string[];
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
};

export type CounterStore = CounterState & CounterActions;
