"use client";

import { Card } from "@repo/design-system/server";
import { useElectionStore } from "../../../stores/electionStore";
import { calculateAllMatches } from "../../common/MatchCalculator";

export default function Page() {
  const candidatesAnswers = useElectionStore((state) => state.candidatesAnswers);
  const answers = useElectionStore((state) => state.answers);
  console.log(candidatesAnswers);
  console.log(answers);

  if (!answers) {
    return null;
  }
  console.log(calculateAllMatches(answers, candidatesAnswers));

  const results = calculateAllMatches(answers, candidatesAnswers);
  const resultsLimit = results?.slice(0, 40);
  return (
    <div className="h-1/3">
      Výsledky
      <div className="bg-amber-300 overflow-y-auto">
        {resultsLimit?.map((result) => (
          <Card key={result.candidateId} color="white">
            <div className="flex gap-2">
              <span>{result.candidateId}</span>
              <span>{result.percentage}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
