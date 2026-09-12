import { useAnswers, useCalculatedMatches, useCalculator, useQuestions, useResult } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { ComparisonPage } from "@/calculator";
import { useEmbed } from "@/components/client";
import { appConfig } from "@/config/app-config";
import { canonical, type RouteSegments, routes } from "@/lib/routing";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches);
  const answers = useAnswers();
  const questions = useQuestions();
  const embed = useEmbed();
  const locale = useLocale();

  const handlePreviousClick = () => {
    router.push(routes.result(segments, locale));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <ComparisonPage
      homepageHref={canonical.homepage()}
      privacyHref={appConfig.links?.privacy}
      embedContext={embed}
      calculator={calculator}
      result={result}
      answers={answers}
      questions={questions}
      onPreviousClick={handlePreviousClick}
      onCloseClick={handleCloseClick}
    />
  );
}
