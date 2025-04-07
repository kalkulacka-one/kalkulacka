"use client";

import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";

type RecapInjectProps = {
  questions: Promise<void>;
};
export default function RecapInject({ questions }: RecapInjectProps) {
  const setQuestions = useElectionStore((state) => state.setQuestions);
  const setUserLocation = useElectionStore((state) => state.setUserLocation);
  // better naming ?
  const storeQuestions = useElectionStore((state) => state.questions);
  useEffect(() => {
    setUserLocation("rekapitulace");
    // better solution ?
    if (storeQuestions.length === 0) {
      setQuestions(questions);
      console.log("Recap questions injected");
    }
  }, []);
  return null;
}
