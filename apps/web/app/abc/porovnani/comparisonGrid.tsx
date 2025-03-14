"use client";

import { useQuestionsStore } from "../providers/storeProvider";
import organizations from "./data/organizations.json";
import candidates from "./data/candidates.json";
import candidatesAnswers from "./data/candidates-answers.json";
import ComparisonGridDividers from "./comparisonGridDividers";
import ComparisonGridCandidates from "./comparisonGridCandidates";
import ComparisonGridCard from "./comparisonGridCard";
import ComparisonGridUser from "./comparisonGridUser";

export default function ComparisonGrid() {
  const questions = useQuestionsStore((state) => state.questions);

  return (
    <div className="grid auto-cols-max grid-flow-col justify-center justify-items-center gap-y-6 overscroll-x-auto p-2 xs:gap-x-4 xs:p-4  sm:gap-x-8  sm:p-8 ">
      <ComparisonGridDividers organizations={organizations} />
      <ComparisonGridUser questions={questions} />
      <ComparisonGridCandidates
        organizations={organizations}
        candidates={candidates}
        candidatesAnswers={candidatesAnswers}
      />
      <ComparisonGridCard questions={questions} />
    </div>
  );
}
