import { useContext, useEffect, useRef } from "react";

import type { calculateMatches } from "../calculator/lib/result-calculation/calculate-matches";
import { AnswersStoreContext } from "../calculator/stores/answers";
import { useCalculator } from "../calculator/view-models";
import { saveSessionDataWithBeacon } from "../lib/api/session-data";
import { reportError } from "../lib/monitoring";

export type UseAutoSaveOptions = {
  matches?: ReturnType<typeof calculateMatches>;
  enabled?: boolean;
};

export function useAutoSave({ matches, enabled = true }: UseAutoSaveOptions = {}) {
  const store = useContext(AnswersStoreContext);
  const calculator = useCalculator();
  const savingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const save = async () => {
      if (savingRef.current) return;
      savingRef.current = true;

      try {
        const answers = store?.getState().answers;
        if (answers && answers.length > 0) {
          await saveSessionDataWithBeacon(calculator.id, answers, matches, calculator.version);
        }
      } catch (error) {
        reportError(error);
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
  }, [enabled, matches, calculator.id, calculator.version, store]);
}
