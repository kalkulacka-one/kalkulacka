"use client";
import { useQuestionsStore } from "./../store";
import { QuestionWrapper, BottomBar } from "@repo/design-system/ui";
import type { ExtendedQuestions } from "./../store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  // cleanup and better naming
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);
  const setCurrentQuestion = useQuestionsStore(
    (state) => state.setCurrentQuestion,
  );

  useEffect(() => {
    // Always do navigations after the first render
    // shallow error?
    router.push(`/xyz/${currentQuestion}`, undefined, { shallow: true });
  }, [currentQuestion]);

  useEffect(() => {
    setCurrentQuestion(Number(params.number));
  }, []);

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
    if (currentQuestion !== questions.length) {
      answerYes();
      skipQuestion();
    } else {
      router.push("/xyz/rekapitulace");
    }
  };

  const noClick = () => {
    if (currentQuestion !== questions.length) {
      answerNo();
      skipQuestion();
    } else {
      router.push("/xyz/rekapitulace");
    }
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
              questionTotal={questions.length}
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
