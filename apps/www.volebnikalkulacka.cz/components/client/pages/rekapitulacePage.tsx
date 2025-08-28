import { useParams, useRouter } from "next/navigation";
import { RekapitulaceView } from "../../../calculator/components/RekapitulaceView";
import { useElectionStore } from "../../../stores/electionStore";

export function RekapitulacePage() {
  const answers = useElectionStore((state) => state.answers);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const params = useParams();
  const router = useRouter();
  const calculator = useElectionStore((state) => state.calculator);

  const handleGoToQuestions = () => {
    router.push(`/${params.first}/${params.second}/otazka/${answers?.length}`);
  };

  const handleGoToResults = () => {
    router.push(`/${params.first}/${params.second}/vysledek`);
  };

  return (
    <RekapitulaceView
      isLoading={!calculator}
      questions={calculator?.questions || []}
      answers={answers || []}
      onAnswerChange={handleAnswer}
      onGoToQuestions={handleGoToQuestions}
      onGoToResults={handleGoToResults}
    />
  );
}
