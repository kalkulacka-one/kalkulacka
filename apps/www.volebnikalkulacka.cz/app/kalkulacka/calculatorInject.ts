"use client";
import { useEffect } from "react";
import { useElectionStore } from "../stores/electionStore";

export default function CalculatorInject({ calculator, candidatesAnswers }: { calculator: any; candidatesAnswers: any }) {
  const setCalculator = useElectionStore((state) => state.setCalculator);
  const setCandidatesAnswers = useElectionStore((state) => state.setCandidatesAnswers);
  useEffect(() => {
    console.log("Hello from calculator inject");
    setCalculator(calculator);
    setCandidatesAnswers(candidatesAnswers);
  }, [candidatesAnswers, setCalculator, calculator, setCandidatesAnswers]);
  return null;
}
