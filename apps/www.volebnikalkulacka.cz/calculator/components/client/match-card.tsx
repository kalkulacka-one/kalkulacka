import { ExpandableCard } from "@repo/design-system/client";
import { ProgressBar } from "@repo/design-system/server";
import React, { useState } from "react";

import type { CandidateMatchViewModel } from "../../view-models";
import { useCandidateAnswerComparison, useHasDirectAnswers } from "../../view-models/client/candidate";

export type MatchCard = CandidateMatchViewModel;

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

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
            <ExpandableCard.HiddenContent className="px-4 sm:px-6 pb-4 sm:pb-6 bg-white">
              <div className="border-t border-slate-200 pt-4">
                {/* Answer Comparisons Grid */}
                {answerComparisons.length > 0 && (
                  <div className="grid grid-cols-[1fr_auto] gap-y-2 gap-x-1 auto-rows-auto">
                    <div className="col-span-2 text-right mb-2">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                        <span>Betaverze porovnání. Ještě ladíme!</span>
                      </div>
                    </div>
                    {/* Grid Header Row */}
                    <div />
                    <div>Já • Kandidát</div>

                    {answerComparisons.map((comparison) => (
                      <React.Fragment key={comparison.questionId}>
                        {/* Question + Metadata Wrapper */}
                        <div className="space-y-2">
                          {/* Question Text */}
                          <div className="text-slate-800 font-medium text-sm">{comparison.questionText}</div>

                          {/* Comment if available - candidate or expert */}
                          {(comparison.candidateComment || comparison.expertComment) && (
                            <blockquote className="text-slate-600 italic pl-4 border-l-2 border-slate-200 text-sm">"{comparison.candidateComment || comparison.expertComment}"</blockquote>
                          )}

                          {/* Sources if available - candidate or expert */}
                          {((comparison.candidateSources && comparison.candidateSources.length > 0) ||
                            (comparison.expertSources && comparison.expertSources.length > 0) ||
                            comparison.candidateAnswer === null ||
                            comparison.candidateAnswer === undefined) && (
                            <div className="text-xs text-slate-500">
                              {comparison.candidateAnswer === null || comparison.candidateAnswer === undefined ? (
                                <div className="space-y-1">
                                  <div>
                                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">
                                      <span>Postoj strany se nepodařilo z veřejných zdrojů zjistit</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                (comparison.candidateSources || comparison.expertSources)?.map((source, i) => {
                                  const sourceKey = `${comparison.questionId}-${i}`;
                                  const isExpanded = expandedSources.has(sourceKey);

                                  return (
                                    <div key={source.url || `source-${i}`} className="space-y-1">
                                      <div>
                                        <button
                                          type="button"
                                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs"
                                          onClick={() => {
                                            const newExpanded = new Set(expandedSources);
                                            if (isExpanded) {
                                              newExpanded.delete(sourceKey);
                                            } else {
                                              newExpanded.add(sourceKey);
                                            }
                                            setExpandedSources(newExpanded);
                                          }}
                                        >
                                          <span>{source.title || source.url || "Zdroj"}</span>
                                          <svg className="w-3 h-3" viewBox="0 0 24 24" aria-label="Info">
                                            <path
                                              fill="currentColor"
                                              d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
                                            />
                                          </svg>
                                        </button>
                                      </div>

                                      {isExpanded && (
                                        <blockquote className="text-slate-600 italic pl-4 border-l-2 border-slate-200 text-sm">
                                          {source.description || "Žádný popis není k dispozici"}
                                          {source.url && (
                                            <>
                                              {" "}
                                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                                (odkaz)
                                              </a>
                                            </>
                                          )}
                                        </blockquote>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>

                        {/* Answer Comparison */}
                        <div className="flex items-center gap-1">
                          <div
                            className={`px-3 py-1 rounded text-sm font-bold ${
                              comparison.userAnswer === comparison.candidateAnswer && comparison.userAnswer !== null && comparison.userAnswer !== undefined
                                ? comparison.userAnswer === true
                                  ? "bg-blue-600 text-white"
                                  : "bg-red-600 text-white"
                                : "bg-transparent text-slate-600"
                            }`}
                          >
                            <span>{comparison.userAnswer === true ? "✓" : comparison.userAnswer === false ? "✗" : "—"}</span>
                            <span className="mx-1">•</span>
                            <span>{comparison.candidateAnswer === true ? "✓" : comparison.candidateAnswer === false ? "✗" : "—"}</span>
                          </div>
                        </div>
                      </React.Fragment>
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
