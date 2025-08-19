"use client";
import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";

export default function QuestionsInject({ questions }: { questions: any }) {
  const setQuestions = useElectionStore((state) => state.setQuestions);
  const setAnswers = useElectionStore((state) => state.setAnswers);
  const existingQuestions = useElectionStore((state) => state.questions);
  const existingAnswers = useElectionStore((state) => state.answers);
  useEffect(() => {
    console.log("Hello from questions inject");
    if (!existingQuestions) {
      setQuestions(questions);
    }
    if (!existingAnswers) {
      setAnswers();
    }
  }, [questions, setQuestions, setAnswers, existingAnswers, existingQuestions]);

  return null;
}
