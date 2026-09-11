import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { AnswersPage } from "../../../../calculator/components/server";
import { useCalculatorStore } from "../../../../calculator/stores";
import { type CandidateAnswer, candidatesAnswersViewModel, useCalculator, useCandidates, useQuestions } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

export function AnswersPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const candidates = useCandidates();
  const rawCandidatesAnswers = useCalculatorStore((state) => state.data.candidatesAnswers);
  const candidatesAnswers = useMemo(() => {
    const filtered: Record<string, CandidateAnswer[]> = {};
    for (const [candidateId, answers] of Object.entries(rawCandidatesAnswers)) {
      filtered[candidateId] = answers.filter(
        (answer): answer is CandidateAnswer => answer.respondent === "candidate" || answer.respondent === "expert" || answer.respondent === undefined,
      );
    }
    return candidatesAnswersViewModel(filtered);
  }, [rawCandidatesAnswers]);
  const questions = useQuestions();
  const embed = useEmbed();

  const handlePreviousClick = () => {
    router.push(routes.result(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <AnswersPage
      embedContext={embed}
      calculator={calculator}
      candidates={candidates}
      candidatesAnswers={candidatesAnswers}
      questions={questions}
      onPreviousClick={handlePreviousClick}
      onCloseClick={handleCloseClick}
    />
  );
}
