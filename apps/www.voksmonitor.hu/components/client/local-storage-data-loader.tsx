"use client";

import { useEffect, useRef } from "react";

import { useAnswersStore } from "../../calculator/stores/answers";
import { useCalculatorStore } from "../../calculator/stores/calculator";
import { loadAnswersFromLocalStorage } from "../../lib/local-storage";

/**
 * Loads previously saved answers from localStorage into the answers store.
 * This replaces the old SessionDataLoader which fetched from the server.
 */
export function LocalStorageDataLoader() {
  const loadedCalculatorId = useRef<string | null>(null);
  const calculator = useCalculatorStore((state) => state.data.calculator);
  const answers = useAnswersStore((state) => state.answers);
  const setAnswers = useAnswersStore((state) => state.setAnswers);

  useEffect(() => {
    if (loadedCalculatorId.current === calculator.id) {
      return;
    }

    if (answers.length > 0) {
      return;
    }

    loadedCalculatorId.current = calculator.id;

    const savedAnswers = loadAnswersFromLocalStorage(calculator.id);
    if (savedAnswers.length > 0) {
      setAnswers(savedAnswers);
    }
  }, [calculator.id, answers.length, setAnswers]);

  return null;
}
