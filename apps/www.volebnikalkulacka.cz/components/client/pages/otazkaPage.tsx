import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { OtazkaView } from "../../../calculator/components/OtazkaView";
import { useElectionStore } from "../../../stores/electionStore";
import UrlUpdater from "../../urlUpdater";

export function OtazkaPage({ questionStep }: { questionStep: number }) {
  const params = useParams();
  const router = useRouter();
  const calculator = useElectionStore((state) => state.calculator);
  const storeQuestionStep = useElectionStore((state) => state.questionStep);
  const setStoreQuestionStep = useElectionStore((state) => state.setQuestionStep);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const answers = useElectionStore((state) => state.answers);
  const handleQuestionStep = useElectionStore((state) => state.handleQuestionStep);

  useEffect(() => {
    setStoreQuestionStep(questionStep);
  }, [questionStep, setStoreQuestionStep]);

  const currentQuestion = calculator?.questions[storeQuestionStep - 1];
  const currentQuestionId = currentQuestion?.id;
  const storeMaxQuestionStep = calculator?.questions.length ?? 0;
  const currentAnswer = answers?.[storeQuestionStep - 1];

  const handleYes = () => {
    if (currentQuestionId) {
      if ((storeQuestionStep === storeMaxQuestionStep && currentAnswer?.answer === null) || currentAnswer?.answer === false) {
        router.push(`/${params.first}/${params.second}/rekapitulace`);
      }
      handleAnswer(currentQuestionId, "yes", "otazka");
    }
  };

  const handleNo = () => {
    if (currentQuestionId) {
      if ((storeQuestionStep === storeMaxQuestionStep && currentAnswer?.answer === null) || currentAnswer?.answer === true) {
        router.push(`/${params.first}/${params.second}/rekapitulace`);
      }
      handleAnswer(currentQuestionId, "no", "otazka");
    }
  };

  const handleImportantToggle = () => {
    if (currentQuestionId) {
      handleAnswer(currentQuestionId, "important", "otazka");
    }
  };

  const handlePrevious = () => {
    handleQuestionStep("previous");
  };

  const handleSkip = () => {
    handleQuestionStep("next");
  };

  const handleRecap = () => {
    router.push(`/${params.first}/${params.second}/rekapitulace`);
  };

  const handleNavod = () => {
    router.push(`/${params.first}/${params.second}/navod/1`);
  };

  return (
    <>
      <UrlUpdater />
      <OtazkaView
        isLoading={!calculator}
        question={currentQuestion}
        questionStep={storeQuestionStep}
        maxQuestionStep={storeMaxQuestionStep}
        answer={currentAnswer}
        onImportantToggle={handleImportantToggle}
        onYes={handleYes}
        onNo={handleNo}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onRecap={handleRecap}
        onNavod={handleNavod}
      />
    </>
  );
}
