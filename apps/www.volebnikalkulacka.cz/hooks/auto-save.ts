import type { calculateMatches } from "@kalkulacka-one/app";

import { useContext, useEffect, useRef } from "react";

import { AnswersStoreContext } from "@kalkulacka-one/app/client";
import { useCalculator } from "@/calculator/client";
import { saveSessionDataWithBeacon } from "@/lib/api";
import { reportError } from "@/lib/monitoring";

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

        if (!answers || answers.length === 0) {
          return;
        }

        if (matches) {
          const hasValidMatches = matches.some((match) => match.match !== undefined);
          if (!hasValidMatches) {
            return;
          }
        }

        await saveSessionDataWithBeacon(calculator.id, answers, matches, calculator.version);
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
