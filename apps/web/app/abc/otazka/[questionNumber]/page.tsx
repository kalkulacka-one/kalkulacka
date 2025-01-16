"use client";

import { BottomBar, QuestionWrapper } from "@repo/design-system/ui";
import { useQuestionsStore } from "../../providers/storeProvider";
import { Question } from "@repo/schema/dist";
import { useEffect } from "react";
import { useParams } from "next/navigation";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

export default function Page() {
  const params = useParams();
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuestionsStore(
    (state) => state.setCurrentQuestion,
  );
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  // ** NEEEDS REFACTOR! ** set question from params
  useEffect(() => {
    setCurrentQuestion(Number(params.questionNumber));
  }, []);

  return (
    <>
      <main className="relative flex h-screen items-center justify-center">
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
      </main>
      {/* Bottom bar wrapper */}
      {questions.map((question: ExtendedQuestions, index) => {
        if (currentQuestion === index + 1) {
          return (
            <BottomBar
              key={question.id}
              questions={questions}
              currentQuestion={currentQuestion}
              questionTotal={questions.length}
              toggleImportant={() => toggleImportant(currentQuestion)}
              yesClick={() => answerYes(currentQuestion)}
              noClick={() => answerNo(currentQuestion)}
              yesPressed={question.answerType ? true : undefined}
              noPressed={!question.answerType ? true : undefined}
              starPressed={question.isImportant ? true : undefined}
            />
          );
        }
      })}
    </>
  );
}

// TODO:
// 1. solve installHookJsError (see screenshot)
