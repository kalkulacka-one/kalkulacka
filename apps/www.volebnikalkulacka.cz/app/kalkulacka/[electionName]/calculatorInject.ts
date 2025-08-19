"use client";
import { useEffect } from "react";
import { useElectionStore } from "../../stores/electionStore";

export default function CalculatorInject({ calculator }: { calculator: any }) {
  const setCalculator = useElectionStore((state) => state.setCalculator);
  useEffect(() => {
    console.log("Hello from calculator inject");
    setCalculator(calculator);
  }, [calculator, setCalculator]);
  return null;
}
