"use client";

import type { Question } from "@repo/schema/dist";

type Props = {
  // fix type!
  questions?: any[];
};

import { QuestionWrapper, BottomBar } from "@repo/design-system/ui";
import { useState } from "react";

export default function QuestionPageWrapper({ questions }) {
  const [steps, setSteps] = useState();
  return (
    <div>
      <span>Questions length: {questions.length}</span>
      {questions.length > 0 &&
        questions.map((question: Question, index: number) => {
          const currentQuestion = index + 1;
          return (
            <QuestionWrapper
              key={`Question: ${question.id}`}
              currentQuestion={currentQuestion}
              questionCount={questions.length}
              question={question}
              onClick={() => alert("Clicked")}
            />
          );
        })}
      {/* <ClientBottomBar steps={steps} /> */}
    </div>
  );
}
