import { useParams, useRouter } from "next/navigation";
import { VysledekView } from "../../../calculator/components/VysledekView";
import { calculateFinalResult } from "../../../common/calculateFinalResult";
import { useElectionStore } from "../../../stores/electionStore";

export function VysledekPage() {
  const params = useParams();
  const router = useRouter();
  const calculator = useElectionStore((state) => state.calculator);
  const answers = useElectionStore((state) => state.answers);

  const handleStartCalculator = () => {
    router.push(`/${params.first}/${params.second}/otazka/1`);
  };

  const handleGoToRecap = () => {
    router.push(`/${params.first}/${params.second}/rekapitulace`);
  };

  if (!calculator || !answers) {
    return <VysledekView isLoading={true} results={[]} noAnswerFromUser={false} onStartCalculator={handleStartCalculator} onGoToRecap={handleGoToRecap} />;
  }

  const candidatesAnswers = calculator.candidatesAnswers;
  const candidates = calculator.candidates;
  const results = calculateFinalResult(answers, candidates, candidatesAnswers);
  const noAnswerFromUser = answers.every((answer) => answer.answer === null);

  return <VysledekView isLoading={false} results={results} noAnswerFromUser={noAnswerFromUser} onStartCalculator={handleStartCalculator} onGoToRecap={handleGoToRecap} />;
}
