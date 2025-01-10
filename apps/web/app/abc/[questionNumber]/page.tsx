"use client";

import { BottomBar, QuestionWrapper } from "@repo/design-system/ui";
import { useQuestionsStore } from "../providers/storeProvider";
import { Question } from "@repo/schema/dist";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div>
        {/* questions wrapper */}
        {questions.map((question: ExtendedQuestions, index) => {
          if (currentQuestion === index + 1) {
            return (
              <QuestionWrapper
                key={`Question card id:${question.id}`}
                question={question}
                currentQuestion={currentQuestion}
                questionCount={questions.length}
                skipQuestion={skipQuestion}
                prevQuestion={prevQuestion}
              />
            );
          }
        })}
      </div>
    </main>
  );
}

// TODO:
// 1. solve installHookJsError (see screenshot)
