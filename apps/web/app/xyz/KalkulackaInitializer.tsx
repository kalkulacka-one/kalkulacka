"use client";

import React from "react";
import { useQuestionsStore } from "./store";
import type { ExtendedQuestions } from "./store";

type Props = {
  questions: any;
  children: React.ReactNode;
};

export default function KalkulackaInitializer({ questions, children }: Props) {
  useQuestionsStore.setState(() => {
    const updatedTestQuestions = questions.map(
      (question: ExtendedQuestions) => {
        return {
          ...question,
          isImportant: null,
          answerType: null,
        };
      },
    );
    return { questions: updatedTestQuestions };
  });

  return children;
}

// TODOS:
// 1. Solve warning: Cannot update a component (`useQuestionsStoreProvider`) while rendering a different component (`KalkulackaInitializer`). To locate the bad setState() call inside `KalkulackaInitializer`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
// see: https://github.com/facebook/react/issues/18147#issuecomment-592267650
