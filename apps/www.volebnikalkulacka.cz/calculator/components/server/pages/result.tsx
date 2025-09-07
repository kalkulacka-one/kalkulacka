import type { CandidateMatchViewModel, ResultViewModel } from "../../../view-models";
import { MatchCard } from "../components";

export type ResultPage = {
  result: ResultViewModel;
};

const RenderCandidateMatch = ({ match, depth = 0 }: { match: CandidateMatchViewModel; depth?: number }) => {
  const marginLeft = depth > 0 ? `${depth}rem` : "0";

  return (
    <div key={match.candidate.id}>
      <div style={{ marginLeft, marginTop: depth > 0 ? "0.5rem" : "0" }}>
        <MatchCard candidate={match.candidate} order={match.order} match={match.match} />
      </div>
      {match.nestedMatches?.map((nestedMatch) => (
        <RenderCandidateMatch key={nestedMatch.candidate.id} match={nestedMatch} depth={depth + 1} />
      ))}
    </div>
  );
};

export function ResultPage({ result }: ResultPage) {
  return (
    <>
      {result.matches.map((match) => (
        <RenderCandidateMatch key={match.candidate.id} match={match} />
      ))}
    </>
  );
}
