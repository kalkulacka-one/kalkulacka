import { Card, ProgressBar } from "@repo/design-system/server";
import { useState } from "react";

import type { CandidateMatchViewModel, CandidateViewModel } from "../../../view-models";
import { useCandidateAnswerComparison, useHasDirectAnswers } from "../../../view-models/client/candidate";

export type MatchCard = CandidateMatchViewModel;

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  const [showAnswers, setShowAnswers] = useState(false);
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);

  return (
    <Card corner="topLeft" shadow="hard" className="overflow-hidden border border-slate-200">
      {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
      <div className="grid gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${order === 1 ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "bg-slate-700 text-slate-50"}`}>
            <span className="text-2xl font-bold">{order !== undefined ? order : "—"}</span>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold leading-tight text-slate-700">{candidate.displayName}</h3>
            {candidate.organization && <p className="text-sm text-slate-500">{candidate.organization}</p>}
            {respondent === "expert" && (
              <p className="text-xs text-gray-500">
                Postoje podle veřejných zdrojů,
                <br /> strana neodpověděla na zaslané otázky.
              </p>
            )}
          </div>
          <div>
            <span className="text-3xl font-bold tracking-tight text-slate-800">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
          </div>
        </div>
      </div>

      {hasDirectAnswers && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <h4 style={{ margin: "0 0 1rem 0" }}>Debug: Answer Comparison</h4>
          <div>
            <strong>Has Direct Answers:</strong> {hasDirectAnswers ? "Yes" : "No"}
          </div>
          <div>
            <strong>Candidate ID:</strong> {candidate.id}
          </div>
          <div>
            <strong>Number of comparisons:</strong> {answerComparisons.length}
          </div>

          {answerComparisons.length > 0 && (
            <div style={{ marginTop: "1rem" }}>
              <h5>Comparisons:</h5>
              {answerComparisons.map((comparison, index) => (
                <div
                  key={comparison.questionId}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    Question {index + 1}
                    {comparison.isImportant && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.8em",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        (Important)
                      </span>
                    )}
                  </div>
                  <div style={{ marginBottom: "0.5rem", fontStyle: "italic" }}>{comparison.questionText}</div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div>
                      <strong>You:</strong> {formatAnswer(comparison.userAnswer)}
                    </div>
                    <div>
                      <strong>Candidate:</strong> {formatAnswer(comparison.candidateAnswer)}
                    </div>
                    {comparison.expertAnswer !== undefined && (
                      <div>
                        <strong>Expert:</strong> {formatAnswer(comparison.expertAnswer)}
                      </div>
                    )}
                  </div>
                  {comparison.candidateComment && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
                      <strong>Candidate's Comment:</strong> {comparison.candidateComment}
                    </div>
                  )}
                  {comparison.candidateSources && comparison.candidateSources.length > 0 && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
                      <strong>Candidate's Sources:</strong>
                      <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                        {comparison.candidateSources.map((source, i) => (
                          <li key={i}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0056b3", textDecoration: "underline" }}>
                              {source.title || source.url}
                            </a>
                            {source.description && `: ${source.description}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {comparison.expertComment && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
                      <strong>Expert's Comment:</strong> {comparison.expertComment}
                    </div>
                  )}
                  {comparison.expertSources && comparison.expertSources.length > 0 && (
                    <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #eee" }}>
                      <strong>Expert's Sources:</strong>
                      <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                        {comparison.expertSources.map((source, i) => (
                          <li key={i}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0056b3", textDecoration: "underline" }}>
                              {source.title || source.url}
                            </a>
                            {source.description && `: ${source.description}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function formatAnswer(answer: boolean | null | undefined): string {
  if (answer === true) return "true";
  if (answer === false) return "false";
  if (answer === null) return "null";
  return "undefined";
}
