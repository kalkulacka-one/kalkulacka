"use client";
import { QuestionWrapper } from "@repo/design-system/ui";
import { ExtendedQuestions, useQuestionsStore } from "../store";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const router = useRouter();
  const paramsNumber = Number(params.index);

  const prevClick = () => {
    if (currentQuestion < 1) {
      router.push("/xyz/navod");
    } else {
      prevQuestion();
      router.push(`/xyz/${paramsNumber - 1}`);
    }
  };

  const skipClick = () => {
    if (currentQuestion === questions.length) {
      router.push("/xyz/rekapitulace");
    } else {
      skipQuestion();
      router.push(`/xyz/${paramsNumber + 1}`);
    }
  };

  return (
    <div>
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
    </div>
  );
}
