"use client";
import { useEffect } from "react";
import type { Questions } from "../../../../../../packages/schema/schemas/questions.schema";
import { useElectionStore } from "../../../stores/electionStore";

export default function QuestionsInject({ questions, candidatesAnswers }: { questions: Questions; candidatesAnswers: any }) {
  const setQuestions = useElectionStore((state) => state.setQuestions);
  const setCandidatesAnswers = useElectionStore((state) => state.setCandidatesAnswers);
  const setAnswers = useElectionStore((state) => state.setAnswers);
  const existingQuestions = useElectionStore((state) => state.questions);
  const existingAnswers = useElectionStore((state) => state.answers);
  const existingCandidatesAnswers = useElectionStore((state) => state.candidatesAnswers);
  useEffect(() => {
    console.log("Hello from questions inject");

    if (!existingQuestions) {
      setQuestions(questions);
    }
    if (!existingAnswers) {
      setAnswers();
    }
    if (!existingCandidatesAnswers) {
      setCandidatesAnswers(candidatesAnswers);
    }
  }, [questions, setQuestions, setAnswers, existingAnswers, existingQuestions, setCandidatesAnswers, existingCandidatesAnswers, candidatesAnswers]);

  return null;
}
