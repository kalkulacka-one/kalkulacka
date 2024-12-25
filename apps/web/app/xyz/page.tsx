"use client";
import { useQuestionsStore } from "./store";
import { QuestionWrapper, BottomBar } from "@repo/design-system/ui";
import { useRouter } from "next/navigation";
import type { ExtendedQuestions } from "./store";
import { useEffect } from "react";

export default function Page() {
  // cleanup and better naming
  // const testQuestions = useQuestionsStore((state) => state.testQuestions);
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const questionTotal = useQuestionsStore((state) => state.questionTotal);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);
  const router = useRouter();

  // understand this approach more!
  useEffect(() => {
    if (currentQuestion) {
      const slug = `/xyz/${currentQuestion}`;
      if (window.location.pathname !== slug) {
        window.history.replaceState(null, "", slug);
      }
    }
  }, [currentQuestion]);

  const prevClick = () => {
    if (currentQuestion === 1) {
      router.push("/xyz/navod");
    } else {
      prevQuestion();
    }
  };

  const skipClick = () => {
    if (currentQuestion === questions.length) {
      router.push("/xyz/rekapitulace");
    } else {
      skipQuestion();
    }
  };

  const yesClick = () => {
    answerYes();
    skipQuestion();
  };

  const noClick = () => {
    answerNo();
    skipQuestion();
  };

  return (
    <div>
      {/* questions wrapper */}
      {questions.map((question: ExtendedQuestions, index) => {
        const currentStep = index + 1;
        if (currentStep === currentQuestion) {
          return (
            <QuestionWrapper
              key={`Question card id:${question.id}`}
              question={question}
              currentQuestion={currentQuestion}
              questionCount={questions.length}
              skipQuestion={skipClick}
              prevQuestion={prevClick}
            />
          );
        }
      })}
      {/* Bottom bar wrapper */}
      {questions.map((question: ExtendedQuestions, index) => {
        const currentStep = index + 1;
        if (currentStep === currentQuestion) {
          return (
            <BottomBar
              key={`Bottom bar id:${question.id}`}
              questions={questions}
              currentQuestion={currentQuestion}
              questionTotal={questionTotal}
              toggleImportant={toggleImportant}
              yesClick={yesClick}
              noClick={noClick}
              starPressed={question.isImportant ? true : undefined}
            />
          );
        }
      })}
    </div>
  );
}
