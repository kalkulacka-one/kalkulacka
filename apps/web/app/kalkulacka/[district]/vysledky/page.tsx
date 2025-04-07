"use client";

import { useElectionStore } from "../../../stores/electionStore";
import { useParams } from "next/navigation";

import ResultsFallback from "./resultsFallback";
import ResultsHeader from "./resultsHeader";
import ResultsWrapper from "./resultsWrapper";

export default function Page() {
  const params = useParams();
  const district = params.district;
  const questions = useElectionStore((state) => state.questions);
  const isAnswered = questions.every(
    (question: any) => question.answerType === null,
  );

  return (
    <>
      <header
        className="sticky left-0 top-0 z-[100] max-w-[100vw]"
        style={{ gridArea: "sticky-header" }}
      >
        <ResultsHeader district={district} />
      </header>
      <main className="grid" style={{ gridArea: "main" }}>
        <div
          className="grid grid-rows-[1fr_auto]"
          style={{ gridTemplateAreas: `"main" "bottom-bar"` }}
        >
          {!isAnswered ? (
            <ResultsWrapper questions={questions} />
          ) : (
            <ResultsFallback />
          )}
        </div>
      </main>
    </>
  );
}
