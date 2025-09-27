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
  const calculator = useCalculatorStore((state) => state.calculator);
  const embed = useEmbed();

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    const calc = calculator as CalculatorWithVariant | CalculatorWithKey;
    const calculatorKey = "variant" in calc ? calc.variant.key : calc.key;
    const calculatorGroup = "variant" in calc ? calc.calculatorGroup.key : calc.calculatorGroup?.key;

    initializeSession({
      calculatorId: calculator.id,
      calculatorKey,
      calculatorGroup,
      embedName: embed.isEmbed ? embed.name : undefined,
    }).catch(reportError);
  }, [calculator, embed]);

  return null;
}
