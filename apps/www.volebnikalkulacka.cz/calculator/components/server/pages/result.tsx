import type { ResultViewModel } from "../../../view-models";
import { MatchCard } from "../components";

export type ResultPage = {
  resultViewModel: ResultViewModel;
};

export function ResultPage({ resultViewModel }: ResultPage) {
  return (
    <>
      {resultViewModel.matches.map((match) => (
        <MatchCard key={match.candidate.id} candidate={match.candidate} order={match.order} match={match.match} />
      ))}
    </>
  );
}
