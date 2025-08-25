"use client";
import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateAllMatches } from "../../../common/matchCalculator";
import { useElectionStore } from "../../../stores/electionStore";

const getCandidateInfoById = (
  candidateId: string,
  candidates: {
    shortName?: string;
    nestedCandidates?: {
      id: string;
      displayName?: string;
      [key: string]: any;
    }[];
    [key: string]: any;
  }[],
) => {
  for (const mainCandidate of candidates) {
    const nestedCandidate = mainCandidate.nestedCandidates?.find((nested) => nested.id === candidateId);
    if (nestedCandidate) {
      return { main: mainCandidate, nested: nestedCandidate };
    }
  }
  return undefined;
};

export default function VysledekPage() {
  const params = useParams();
  const calculator = useElectionStore((state) => state.calculator);
  const answers = useElectionStore((state) => state.answers);

  if (!calculator) {
    return <div>Loading...</div>;
  }

  const candidatesAnswers = calculator.candidatesAnswers;

  const candidates = calculator.candidates;

  console.log("Console.log", candidates);

  const results = calculateAllMatches(answers, candidatesAnswers);
  const resultsLimit = results?.slice(0, 40);
  const noAnswerFromUser = answers.every((answer) => answer.answer === null);

  if (noAnswerFromUser) {
    return (
      <div>
        <p>Pro zobrazení výsledku musíme mít zodpovězenou alespoň jednu otázku</p>
        <Link href={`/kalkulacka/${params.group}/${params.calculator}/otazka/1`}>
          <Button color="neutral" variant="link">
            Spustit kalkulačku
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="h-1/3">
      Výsledky
      <div>
        {resultsLimit?.map((result) => {
          const candidateInfo = getCandidateInfoById(result.candidateId, candidates);
          return (
            <Card key={result.candidateId} color="white">
              <div className="flex gap-2">
                <span>{candidateInfo ? `${candidateInfo.nested.displayName} (${candidateInfo.main.shortName})` : result.candidateId}</span>
                <span>{result.percentage}%</span>
              </div>
            </Card>
          );
        })}
      </div>
      <Link href={`/kalkulacka/${params.group}/${params.calculator}/rekapitulace`}>
        <Button color="neutral" variant="link">
          Rekapitulace
        </Button>
      </Link>
    </div>
  );
}
