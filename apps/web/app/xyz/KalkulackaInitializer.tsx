"use client";

import React from "react";
import { useQuestionsStore } from "./store";

type Props = {
  testQuestions: any;
  children: React.ReactNode;
};

export default function KalkulackaInitializer({
  testQuestions,
  children,
}: Props) {
  useQuestionsStore.setState(() => {
    const updatedTestQuestions = testQuestions.map((question) => {
      return {
        ...question,
        isImportant: null,
        answerType: null,
      };
    });
    return { questions: updatedTestQuestions };
  });

  return children;
}
