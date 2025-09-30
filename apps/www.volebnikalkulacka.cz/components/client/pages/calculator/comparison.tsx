import { useRouter } from "next/navigation";

import { ComparisonPage } from "../../../../calculator/components/server";
import { useAnswers, useCalculatedMatches, useCalculator, useQuestions, useResult } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";
import { useSession } from "../../session-context-provider";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { sessionId } = useSession();
  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches, sessionId || calculator.id);
  const answers = useAnswers();
  const questions = useQuestions();
  const embed = useEmbed();

  const handlePreviousClick = () => {
    router.push(routes.result(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return <ComparisonPage embedContext={embed} calculator={calculator} result={result} answers={answers} questions={questions} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} />;
}
