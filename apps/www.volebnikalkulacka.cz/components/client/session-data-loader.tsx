import { useEffect, useRef } from "react";

import { useAnswersStore } from "../../calculator/stores/answers";
import { useCalculatorStore } from "../../calculator/stores/calculator";
import { loadSessionData } from "../../lib/api/session-data";
import { reportError } from "../../lib/monitoring";

export function SessionDataLoader() {
  const loadedCalculatorId = useRef<string | null>(null);
  const calculator = useCalculatorStore((state) => state.calculator);
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
      .then((savedAnswers) => {
        if (savedAnswers.length > 0) {
          setAnswers(savedAnswers);
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
