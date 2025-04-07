"use client";

import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";

type QuestionsInjectProps = {
  questions: Promise<void>;
};
export default function QuestionsInject({ questions }: QuestionsInjectProps) {
  const setQuestions = useElectionStore((state) => state.setQuestions);
  const setUserLocation = useElectionStore((state) => state.setUserLocation);
  // better naming ?
  const storeQuestions = useElectionStore((state) => state.questions);
  useEffect(() => {
    setUserLocation("otazka");
    // better solution ?
    if (storeQuestions.length === 0) {
      setQuestions(questions);
      console.log("Questions injected");
    }
  }, []);
  return null;
}
