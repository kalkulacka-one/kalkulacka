import { createContext, useContext } from "react";
import { createStore, type StoreApi, useStore } from "zustand";

import type { CalculatorData } from "../lib";
import { shuffle } from "../lib/utilities";

export type CalculatorStore = CalculatorData;

/**
 * Gets or creates a shuffle seed for this calculator session
 * Uses session ID if available, otherwise creates and stores a temporary seed in sessionStorage
 */
function getShuffleSeed(calculatorId: string, sessionId?: string): string {
  if (sessionId) {
    return sessionId;
  }

  // Create a session-persistent seed using sessionStorage
  const storageKey = `calculator-shuffle-seed-${calculatorId}`;

  if (typeof window !== "undefined" && window.sessionStorage) {
    const existingSeed = sessionStorage.getItem(storageKey);
    if (existingSeed) {
      return existingSeed;
    }

    // Generate a new seed for this browser session
    const newSeed = `${calculatorId}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(storageKey, newSeed);
    return newSeed;
  }

  // Fallback for SSR or when sessionStorage is not available
  return calculatorId;
}

export const createCalculatorStore = (calculatorData: CalculatorData, sessionId?: string) => {
  // Get a consistent seed for shuffling - uses session ID when available,
  // otherwise creates a session-persistent seed
  const seed = getShuffleSeed(calculatorData.data.calculator.id, sessionId);

  // Shuffle questions using seed for consistent randomization per session
  const shuffledData = {
    ...calculatorData,
    data: {
      ...calculatorData.data,
      questions: shuffle(calculatorData.data.questions, seed),
    },
  };

  return createStore<CalculatorStore>(() => shuffledData);
};

export const CalculatorStoreContext = createContext<StoreApi<CalculatorStore> | undefined>(undefined);

export function useCalculatorStore<U>(selector: (state: CalculatorStore) => U): U {
  const store = useContext(CalculatorStoreContext);
  if (!store) {
    throw new Error("Missing calculator store provider");
  }
  return useStore(store, selector);
}
