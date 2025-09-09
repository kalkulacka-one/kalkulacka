import type { ResultViewModel } from "../../../view-models";
import { MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
  onPreviousClick: () => void;
};

export function ResultPage({ result, onPreviousClick }: ResultPage) {
  return (
    <>
      {result.matches.map((match) => (
        <MatchCard key={match.candidate.id} candidate={match.candidate} order={match.order} match={match.match} />
      ))}
    </>
  );
}
