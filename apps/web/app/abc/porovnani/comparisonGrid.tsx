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
    <div className="grid auto-cols-max grid-flow-col justify-center justify-items-center gap-x-8 gap-y-6 overscroll-x-auto">
      {/* Dividers */}
      <ComparisonGridDividers organizations={organizations} />
      {/* User */}
      <ComparisonGridUser questions={questions} />
      {/* Candidates */}
      <ComparisonGridCandidates
        organizations={organizations}
        candidates={candidates}
        candidatesAnswers={candidatesAnswers}
      />
      {/* Card */}
      <ComparisonGridCard questions={questions} />
    </div>
  );
}
