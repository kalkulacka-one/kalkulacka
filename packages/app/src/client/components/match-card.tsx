import { ExpandableCard } from "@kalkulacka-one/design-system/client";
import { Avatar, ProgressBar } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useCandidateAnswerComparison, useHasDirectAnswers } from "@/client/view-models/candidate";
import type { CandidateMatchViewModel } from "@/view-models";

export type MatchCard = CandidateMatchViewModel;

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  const t = useTranslations("koa.components.matchCard");
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  return (
    <ExpandableCard corner="topLeft" shadow="hard" className="koa:overflow-hidden koa:border koa:border-slate-200">
      {({ open }) => (
        <>
          {match !== undefined && <ProgressBar value={match} color={order === 1 ? "primary" : "neutral"} corner="sharp" />}
          <ExpandableCard.Content className="koa:grid koa:gap-3 koa:p-4 koa:sm:gap-4 koa:sm:p-6">
            <div className="koa:grid koa:grid-cols-[auto_1fr_auto] koa:gap-4 koa:items-center">
              {candidate.avatar ? (
                <Avatar
                  image={candidate.avatar.urls}
                  backgroundColor="#e2e8f0"
                  shape={candidate.type === "person" ? "circle" : "square"}
                  alignment={candidate.avatar.type === "portrait" ? "top" : "center"}
                  fit={candidate.avatar.type === "logo" ? "contain" : "cover"}
                  padding={candidate.avatar.type === "logo" || candidate.avatar.type === "avatar"}
                  size="large"
                />
              ) : (
                <div
                  className={`koa:flex koa:h-20 koa:w-20 koa:items-center koa:justify-center koa:rounded-2xl ${order === 1 ? "koa:bg-[var(--ko-color-primary)] koa:text-[var(--ko-color-on-bg-primary)]" : "koa:bg-white koa:text-slate-700"}`}
                >
                  <span className="koa:text-3xl koa:font-bold">{order !== undefined ? order : "—"}</span>
                </div>
              )}
              <div className="koa:flex koa:flex-col koa:gap-1 koa:items-start koa:justify-center">
                <h3 className="koa:text-lg koa:font-bold koa:leading-tight koa:text-slate-700">{candidate.displayName}</h3>
                {candidate.organization && <p className="koa:text-sm koa:text-slate-500">{candidate.organization}</p>}
                {respondent === "expert" && (
                  <p className="koa:text-xs koa:text-gray-500">
                    {t("expertNoteLine1")}
                    <br /> {t("expertNoteLine2")}
                  </p>
                )}
              </div>
              <div className="koa:flex koa:items-center koa:gap-2">
                <span className="koa:text-3xl koa:font-bold koa:tracking-tight koa:text-slate-800">{match !== undefined ? `${Math.round(match)} %` : "—"}</span>
                {hasDirectAnswers && <ExpandableCard.Chevron open={open} className="koa:text-slate-400" />}
              </div>
            </div>
          </ExpandableCard.Content>

          {hasDirectAnswers && (
            <ExpandableCard.HiddenContent className="koa:px-4 koa:sm:px-6 koa:pb-4 koa:sm:pb-6 koa:bg-white">
              <div className="koa:border-t koa:border-slate-200 koa:pt-4">
                {/* Answer Comparisons Grid */}
                {answerComparisons.length > 0 && (
                  <div className="koa:grid koa:grid-cols-[1fr_auto] koa:gap-y-2 koa:gap-x-1 koa:auto-rows-auto">
                    <div className="koa:col-span-2 koa:text-right koa:mb-2">
                      <div className="koa:inline-flex koa:items-center koa:px-3 koa:py-1 koa:rounded-full koa:text-xs koa:font-medium koa:bg-amber-100 koa:text-amber-800 koa:border koa:border-amber-200">
                        <span>{t("beta")}</span>
                      </div>
                    </div>
                    {/* Grid Header Row */}
                    <div />
                    <div>{t("meCandidate")}</div>

                    {answerComparisons.map((comparison) => (
                      <React.Fragment key={comparison.questionId}>
                        {/* Question + Metadata Wrapper */}
                        <div className="koa:space-y-2">
                          {/* Question Text */}
                          <div className="koa:text-slate-800 koa:font-medium koa:text-sm">{comparison.questionText}</div>

                          {/* Comment if available - candidate or expert - but not if showing expert no-data badge */}
                          {(comparison.candidateComment || comparison.expertComment) &&
                            !((comparison.candidateAnswer === null || comparison.candidateAnswer === undefined) && respondent === "expert") && (
                              <blockquote className="koa:text-slate-600 koa:italic koa:pl-4 koa:border-l-2 koa:border-slate-200 koa:text-sm">
                                "{comparison.candidateComment || comparison.expertComment}"
                              </blockquote>
                            )}

                          {/* Sources if available - candidate or expert */}
                          {((comparison.candidateSources && comparison.candidateSources.length > 0) ||
                            (comparison.expertSources && comparison.expertSources.length > 0) ||
                            comparison.candidateAnswer === null ||
                            comparison.candidateAnswer === undefined) && (
                            <div className="koa:text-xs koa:text-slate-500">
                              {(comparison.candidateAnswer === null || comparison.candidateAnswer === undefined) && respondent === "expert" ? (
                                <div className="koa:space-y-1">
                                  <div>
                                    <div className="koa:inline-flex koa:items-center koa:gap-1 koa:px-2 koa:py-1 koa:rounded koa:bg-slate-100 koa:text-slate-700 koa:text-xs">
                                      <svg className="koa:w-3 koa:h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z" />
                                      </svg>
                                      <span>{t("positionUnknown")}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                (comparison.candidateSources || comparison.expertSources)?.map((source, i) => {
                                  const sourceKey = `${comparison.questionId}-${i}`;
                                  const isExpanded = expandedSources.has(sourceKey);

                                  return (
                                    <div key={source.url || `source-${i}`} className="koa:space-y-1">
                                      <div>
                                        <button
                                          type="button"
                                          className="koa:inline-flex koa:items-center koa:gap-1 koa:px-2 koa:py-1 koa:rounded koa:bg-slate-100 koa:hover:bg-slate-200 koa:text-slate-700 koa:hover:text-slate-900 koa:text-xs"
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
                                          <span>{source.title || source.url || t("source")}</span>
                                          <svg className="koa:w-3 koa:h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                          </svg>
                                        </button>
                                      </div>

                                      {isExpanded && (
                                        <blockquote className="koa:text-slate-600 koa:italic koa:pl-4 koa:border-l-2 koa:border-slate-200 koa:text-sm">
                                          {source.description || t("noDescription")}
                                          {source.url && (
                                            <>
                                              {" "}
                                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="koa:text-blue-600 koa:hover:text-blue-800 koa:underline">
                                                {t("link")}
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
                        <div className="koa:flex koa:items-center koa:gap-1">
                          <div
                            className={`koa:px-3 koa:py-1 koa:rounded koa:text-sm koa:font-bold ${
                              comparison.userAnswer === comparison.candidateAnswer && comparison.userAnswer !== null && comparison.userAnswer !== undefined
                                ? comparison.userAnswer === true
                                  ? "koa:bg-blue-600 koa:text-white"
                                  : "koa:bg-red-600 koa:text-white"
                                : "koa:bg-transparent koa:text-slate-600"
                            }`}
                          >
                            <span>{comparison.userAnswer === true ? "✓" : comparison.userAnswer === false ? "✗" : "—"}</span>
                            <span className="koa:mx-1">•</span>
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
