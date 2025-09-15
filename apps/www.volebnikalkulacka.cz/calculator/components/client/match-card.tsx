import { ExpandableCard } from "@repo/design-system/client";
import { ProgressBar } from "@repo/design-system/server";

import type { CandidateMatchViewModel } from "../../view-models";
import { useCandidateAnswerComparison, useHasDirectAnswers } from "../../view-models/client/candidate";

export type MatchCard = CandidateMatchViewModel;

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);

  return (
    <ExpandableCard corner="topLeft" shadow="hard" className="overflow-hidden border border-slate-200">
      {({ open }) => (
        <>
          {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
          <ExpandableCard.Content className="grid gap-3 p-4 sm:gap-4 sm:p-6">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${order === 1 ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "bg-slate-700 text-slate-50"}`}
              >
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
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-tight text-slate-800">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
                {hasDirectAnswers && <ExpandableCard.Chevron open={open} className="text-slate-400" />}
              </div>
            </div>
          </ExpandableCard.Content>

          {hasDirectAnswers && (
            <ExpandableCard.HiddenContent className="p-4 sm:p-6 pt-0 bg-slate-50 border-t border-slate-200">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-slate-800">Answer Details</h4>

                {answerComparisons.length > 0 && (
                  <div className="space-y-3">
                    {answerComparisons.map((comparison, index) => (
                      <div key={comparison.questionId} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-800 mb-2">
                          Question {index + 1}
                          {comparison.isImportant && <span className="ml-2 text-sm text-slate-500 font-normal italic">(Important)</span>}
                        </div>

                        <div className="text-slate-600 mb-3 italic">{comparison.questionText}</div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                          <div>
                            <strong className="text-slate-700">You:</strong> <span className="text-slate-600">{formatAnswer(comparison.userAnswer)}</span>
                          </div>
                          <div>
                            <strong className="text-slate-700">Candidate:</strong> <span className="text-slate-600">{formatAnswer(comparison.candidateAnswer)}</span>
                          </div>
                          {comparison.expertAnswer !== undefined && (
                            <div>
                              <strong className="text-slate-700">Expert:</strong> <span className="text-slate-600">{formatAnswer(comparison.expertAnswer)}</span>
                            </div>
                          )}
                        </div>

                        {comparison.candidateComment && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <strong className="text-slate-700">Candidate's Comment:</strong>
                            <p className="text-slate-600 mt-1">{comparison.candidateComment}</p>
                          </div>
                        )}

                        {comparison.candidateSources && comparison.candidateSources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <strong className="text-slate-700">Candidate's Sources:</strong>
                            <ul className="mt-1 pl-4 space-y-1">
                              {comparison.candidateSources.map((source, i) => (
                                <li key={source.url || i} className="text-slate-600">
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                    {source.title || source.url}
                                  </a>
                                  {source.description && <span className="text-slate-500">: {source.description}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {comparison.expertComment && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <strong className="text-slate-700">Expert's Comment:</strong>
                            <p className="text-slate-600 mt-1">{comparison.expertComment}</p>
                          </div>
                        )}

                        {comparison.expertSources && comparison.expertSources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <strong className="text-slate-700">Expert's Sources:</strong>
                            <ul className="mt-1 pl-4 space-y-1">
                              {comparison.expertSources.map((source, i) => (
                                <li key={source.url || i} className="text-slate-600">
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                    {source.title || source.url}
                                  </a>
                                  {source.description && <span className="text-slate-500">: {source.description}</span>}
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
            </ExpandableCard.HiddenContent>
          )}
        </>
      )}
    </ExpandableCard>
  );
}

function formatAnswer(answer: boolean | null | undefined): string {
  if (answer === true) return "true";
  if (answer === false) return "false";
  if (answer === null) return "null";
  return "undefined";
}
