"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";
import UrlUpdater from "../urlUpdater";
import { QuestionView } from "./QuestionView";

export default function OtazkaPage({ questionStep }: { questionStep: number }) {
  const params = useParams();
  const router = useRouter();
  const calculator = useElectionStore((state) => state.calculator);
  const storeQuestionStep = useElectionStore((state) => state.questionStep);
  const setStoreQuestionStep = useElectionStore(
    (state) => state.setQuestionStep
  );
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const answers = useElectionStore((state) => state.answers);
  const handleQuestionStep = useElectionStore(
    (state) => state.handleQuestionStep
  );

  useEffect(() => {
    setStoreQuestionStep(questionStep);
  }, [questionStep, setStoreQuestionStep]);

  if (!calculator) {
    return <div>Loading...</div>;
  }

  const currentQuestion = calculator.questions[storeQuestionStep - 1];
  const currentQuestionId = currentQuestion.id;
  const storeMaxQuestionStep = calculator.questions.length;
  const currentAnswer = answers?.[storeQuestionStep - 1];

  const handleAnswerWithRedirect = (answer: "yes" | "no") => {
    if (
      storeQuestionStep === calculator.questions.length &&
      answers?.[storeQuestionStep - 1]?.answer === null
    ) {
      router.push(
        `/kalkulacka/${params.group}/${params.calculator}/rekapitulace`
      );
    }
    handleAnswer(currentQuestionId, answer, "otazka");
  };

  const isLastStep = storeQuestionStep === storeMaxQuestionStep;
  const footerLinkHref = isLastStep
    ? `/kalkulacka/${params.group}/${params.calculator}/rekapitulace`
    : `/kalkulacka/${params.group}/${params.calculator}/navod/1`;
  const footerLinkText = isLastStep ? "Rekapitulace" : "Návod";

  return (
    <>
      <UrlUpdater />
      <QuestionView
        question={currentQuestion}
        currentStep={storeQuestionStep}
        totalSteps={storeMaxQuestionStep}
        answer={currentAnswer}
        onImportantToggle={() =>
          handleAnswer(currentQuestionId, "important", "otazka")
        }
        onAnswerYes={() => handleAnswerWithRedirect("yes")}
        onAnswerNo={() => handleAnswerWithRedirect("no")}
        onPrevious={() => handleQuestionStep("previous")}
        onSkip={() => handleQuestionStep("next")}
        LinkComponent={Link}
        footerLinkHref={footerLinkHref}
        footerLinkText={footerLinkText}
      />
    </>
  );
}