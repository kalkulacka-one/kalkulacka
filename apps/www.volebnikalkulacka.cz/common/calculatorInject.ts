"use client";

import { useEffect } from "react";
import ElectionStore, { useElectionStore } from "../stores/electionStore";
export default function CalculatorInject({ electionData, calculatorData }: { electionData: any; calculatorData: any }) {
  const calculator = useElectionStore((state) => state.calculator);
  const setCalculator = useElectionStore((state) => state.setCalculator);
  const setAnswers = useElectionStore((state) => state.setAnswers);
  const election = useElectionStore((state) => state.election);
  const setElection = useElectionStore((state) => state.setElection);
  const answers = useElectionStore((state) => state.answers);
  useEffect(() => {
    console.log("Hello from calculator inject!");
    if (!election) {
      setElection(electionData);
    }
    if (!calculator) {
      setCalculator(calculatorData);
    }
    if (!answers) {
      setAnswers();
    }
  }, [calculator, calculatorData, setCalculator, setAnswers, setElection, electionData, answers, election]);
  return null;
}
