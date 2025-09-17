import { useRouter } from "next/navigation";

import { ComparisonPage } from "../../../../calculator/components/server";
import { useAnswers, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const answers = useAnswers();
  const questions = useQuestions();
  const embed = useEmbed();

  const handlePreviousClick = () => {
    router.push(routes.result(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const attribution = embed.isEmbed && (embed.config?.navigationAttribution ?? true);

  return <ComparisonPage calculator={calculator} answers={answers} questions={questions} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} attribution={attribution} />;
}
