import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  questions: string[];
  currentQuestion: number;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  prevQuestion: () => void;
  skipQuestion: () => void;
};

export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = {
  count: 0,
  questions: ["Item 1", "Item 2", "Item 3"],
  currentQuestion: 1,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState,
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    prevQuestion: () =>
      set((state) => ({ currentQuestion: state.currentQuestion - 1 })),
    skipQuestion: () =>
      set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
  }));
};
