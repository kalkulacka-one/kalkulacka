import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { NavodView } from "../../../calculator/components/NavodView";
import { useElectionStore } from "../../../stores/electionStore";

export function NavodPage({ guideStep }: { guideStep: number }) {
  const calculator = useElectionStore((state) => state.calculator);
  const election = useElectionStore((state) => state.election);
  const params = useParams();
  const router = useRouter();
  const storeGuideStep = useElectionStore((state) => state.guideStep);
  const setStoreGuideStep = useElectionStore((state) => state.setGuideStep);
  const handleGuideStep = useElectionStore((state) => state.handleGuideStep);

  useEffect(() => {
    setStoreGuideStep(guideStep);
  }, [guideStep, setStoreGuideStep]);

  const handleStartCalculator = () => {
    router.push(`/${params.first}/${params.second}/otazka/1`);
  };

  const handleSkip = () => {
    router.push(`/${params.first}/${params.second}/otazka/1`);
  };

  return (
    <NavodView
      isLoading={!calculator || !election}
      guideStep={storeGuideStep}
      electionTitle={election?.title}
      calculatorIntro={calculator?.calculator.intro}
      onStartCalculator={handleStartCalculator}
      onSkip={handleSkip}
      handleGuideStep={handleGuideStep}
    />
  );
}
