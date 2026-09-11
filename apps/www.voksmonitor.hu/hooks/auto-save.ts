import { useContext, useEffect, useRef } from "react";

import { AnswersStoreContext } from "../calculator/stores/answers";
import { useCalculator } from "../calculator/view-models";
import { saveAnswersToLocalStorage } from "../lib/local-storage";

export type UseAutoSaveOptions = {
  enabled?: boolean;
};

/**
 * Saves in-progress answers to localStorage whenever the page becomes hidden
 * or before unload. No data is sent to the server — this is purely local persistence
 * so the user can resume if they navigate away.
 */
export function useAutoSave({ enabled = true }: UseAutoSaveOptions = {}) {
  const store = useContext(AnswersStoreContext);
  const calculator = useCalculator();
  const savingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const save = () => {
      if (savingRef.current) return;
      savingRef.current = true;

      try {
        const answers = store?.getState().answers;

        if (!answers || answers.length === 0) {
          return;
        }

        saveAnswersToLocalStorage(calculator.id, answers);
      } finally {
        savingRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") save();
    };

    const handlePageHide = () => save();

    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    window.addEventListener("pagehide", handlePageHide, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [enabled, calculator.id, store]);
}
