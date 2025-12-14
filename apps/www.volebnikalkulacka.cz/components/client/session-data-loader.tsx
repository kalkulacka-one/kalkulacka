import { useEffect, useRef } from "react";

import { useAnswersStore, useCalculatorStore } from "@kalkulacka-one/app/client";
import { loadSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";

export function SessionDataLoader() {
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

    loadSessionData(calculator.id)
      .then((sessionData) => {
        if (sessionData.answers.length > 0) {
          setAnswers(sessionData.answers);
        }
      })
      .catch((error: Response | Error) => {
        if (error instanceof Response) {
          if (error.status === 404 || error.status === 401) {
            return;
          }
          reportError(new Error(`Failed to load session data: ${error.status} ${error.statusText}`));
        } else {
          reportError(error);
        }
      });
  }, [calculator.id, answers.length, setAnswers]);

  return null;
}
