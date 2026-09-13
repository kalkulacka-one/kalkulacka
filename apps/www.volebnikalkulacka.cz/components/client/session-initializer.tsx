import { useCalculatorStore, useEmbed } from "@kalkulacka-one/app/client";
import { initializeSession } from "@kalkulacka-one/next/api";

import { useEffect, useRef } from "react";

import { reportError } from "@/lib/monitoring";

export function SessionInitializer() {
  const initialized = useRef(false);
  const calculator = useCalculatorStore((state) => state.data.calculator);
  const calculatorKey = useCalculatorStore((state) => state.key);
  const calculatorGroup = useCalculatorStore((state) => state.group);
  const embed = useEmbed();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    initializeSession({
      calculatorId: calculator.id,
      calculatorKey,
      calculatorGroup,
      calculatorVersion: calculator.version,
      embedName: embed.isEmbed ? embed.name : undefined,
    }).catch((error: Response | Error) => {
      if (error instanceof Response) {
        if (error.status === 404 || error.status === 401) {
          return;
        }
        reportError(new Error(`Session initialization failed: ${error.status} ${error.statusText}`));
      } else {
        reportError(error);
      }
    });
  }, [calculator, calculatorKey, calculatorGroup, embed]);

  return null;
}
