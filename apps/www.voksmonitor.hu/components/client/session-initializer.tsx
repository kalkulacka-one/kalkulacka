import { useEffect, useRef } from "react";

import { useCalculatorStore } from "../../calculator/stores/calculator";
import { initializeSession } from "../../lib/api";
import { reportError } from "../../lib/monitoring";
import { useEmbed } from "./embed-context-provider";

type CalculatorWithVariant = {
  variant: { key: string };
  calculatorGroup: { key: string };
};

type CalculatorWithKey = {
  key: string;
  calculatorGroup?: { key: string };
};

export function SessionInitializer() {
  const initialized = useRef(false);
  const calculator = useCalculatorStore((state) => state.data.calculator);
  const embed = useEmbed();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    const calc = calculator as CalculatorWithVariant | CalculatorWithKey;
    const calculatorKey = "variant" in calc ? calc.variant.key : calc.key;
    const calculatorGroup = "variant" in calc ? calc.calculatorGroup.key : undefined;

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
  }, [calculator, embed]);

  return null;
}
