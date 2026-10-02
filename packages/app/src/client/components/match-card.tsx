import { ExpandableCard } from "@kalkulacka-one/design-system/client";
import { Avatar, ProgressBar } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { useCandidateAnswerComparison, useHasDirectAnswers } from "@/client/view-models/candidate";
import type { CandidateMatchViewModel } from "@/view-models";

import { partyColor } from "./party-color";

export type MatchCard = CandidateMatchViewModel;

/**
 * Take at most two initials, skipping the punctuation that party names are
 * full of ("ANO 2011" -> "A2", "SMS – Stát Má Sloužit" -> "SS").
 */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function MatchCard({ candidate, order, match, respondent }: MatchCard) {
  const t = useTranslations("koa.components.matchCard");
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  const winner = order === 1;
  const name = candidate.displayName ?? candidate.id;
  const accent = partyColor(name);
  const avatarSize = winner ? "large" : "medium";
  const fallbackSizeClasses = winner ? "koa:h-20 koa:w-20 koa:text-2xl" : "koa:h-14 koa:w-14 koa:text-lg";

  return (
    <ExpandableCard corner="topLeft" shadow="hard" className="koa:overflow-hidden koa:border koa:border-border">
      {({ open }) => (
        <>
          {match !== undefined && <ProgressBar value={match} accentColor={accent} corner="sharp" />}
          {/*
           * Padding and the name/percent/ordinal sizes below are the 2026
           * match row's own values (`packages/ui/src/match-row/match-row.module.css`
           * in kalkulacka-2026), as local arbitrary values — not new tokens, per
           * handoff-tokens.md. Row: 16px/24px (lg); winner: 24px top-bottom ×
           * 16px sides, 32px × 24px on lg.
           */}
          <ExpandableCard.Content className={`koa:grid koa:gap-3 koa:text-left ${winner ? "koa:px-4 koa:py-6 koa:lg:px-6 koa:lg:py-8" : "koa:px-4 koa:py-4 koa:lg:p-6"}`}>
            <div className="koa:grid koa:grid-cols-[auto_1fr_auto] koa:gap-4 koa:items-center">
              {candidate.avatar ? (
                <span className="koa:inline-flex koa:shrink-0 koa:rounded-full koa:overflow-hidden" style={{ boxShadow: `inset 0 0 0 2px ${accent}` }}>
                  <Avatar
                    image={candidate.avatar.urls}
                    backgroundColor="var(--ko-color-surface-sunken)"
                    shape="circle"
                    alignment={candidate.avatar.type === "portrait" ? "top" : "center"}
                    fit={candidate.avatar.type === "logo" ? "contain" : "cover"}
                    padding={candidate.avatar.type === "logo" || candidate.avatar.type === "avatar"}
                    size={avatarSize}
                  />
                </span>
              ) : (
                <div
                  className={`koa:flex koa:shrink-0 koa:items-center koa:justify-center koa:rounded-full koa:font-bold koa:tabular-nums ${fallbackSizeClasses}`}
                  style={{ backgroundColor: `oklch(from ${accent} l c h / 0.16)`, boxShadow: `inset 0 0 0 2px oklch(from ${accent} l c h / 0.6)`, color: accent }}
                  aria-hidden="true"
                >
                  {initialsOf(name)}
                </div>
              )}
              <div className="koa:flex koa:flex-col koa:gap-1 koa:items-start koa:justify-center koa:text-left koa:min-w-0">
                <h3
                  className={`koa:flex koa:items-baseline koa:gap-1.5 koa:font-semibold koa:leading-[1.3] koa:tracking-[-0.01em] koa:text-text-strong ${winner ? "koa:text-[1rem]" : "koa:text-[0.875rem]"}`}
                >
                  {order !== undefined && <span className="koa:text-[0.8125rem] koa:font-bold koa:text-text-muted koa:tabular-nums">{order}.</span>}
                  <span>{candidate.displayName}</span>
                </h3>
                {candidate.organization && <p className="koa:text-sm koa:text-text-muted">{candidate.organization}</p>}
                {respondent === "expert" && (
                  <p className="koa:text-xs koa:text-text-muted">
                    {t("expertNoteLine1")}
                    <br /> {t("expertNoteLine2")}
                  </p>
                )}
              </div>
              <div className="koa:flex koa:items-center koa:gap-2">
                <span
                  className={`koa:font-display koa:font-bold koa:tracking-[-0.01em] koa:tabular-nums koa:text-text-strong koa:whitespace-nowrap ${winner ? "koa:text-[1.5rem]" : "koa:text-[1.25rem]"}`}
                >
                  {match !== undefined ? `${Math.round(match)} %` : "—"}
                </span>
                {hasDirectAnswers && <ExpandableCard.Chevron open={open} className="koa:text-text-muted" />}
              </div>
            </div>
          </ExpandableCard.Content>

          {hasDirectAnswers && (
            <ExpandableCard.HiddenContent className="koa:px-4 koa:sm:px-6 koa:pb-4 koa:sm:pb-6 koa:bg-surface">
              <div className="koa:border-t koa:border-border koa:pt-4">
                {/* Answer Comparisons Grid */}
                {answerComparisons.length > 0 && (
                  <div className="koa:grid koa:grid-cols-[1fr_auto] koa:gap-y-2 koa:gap-x-1 koa:auto-rows-auto">
                    {/* Grid Header Row */}
                    <div />
                    <div>{t("meCandidate")}</div>

                    {answerComparisons.map((comparison) => (
                      <React.Fragment key={comparison.questionId}>
                        {/* Question + Metadata Wrapper */}
                        <div className="koa:space-y-2">
                          {/* Question Text */}
                          <div className="koa:text-text-strong koa:font-medium koa:text-sm">{comparison.questionText}</div>

                          {/* Comment if available - candidate or expert - but not if showing expert no-data badge */}
                          {(comparison.candidateComment || comparison.expertComment) &&
                            !((comparison.candidateAnswer === null || comparison.candidateAnswer === undefined) && respondent === "expert") && (
                              <blockquote className="koa:text-text-muted koa:italic koa:pl-4 koa:border-l-2 koa:border-border koa:text-sm">
                                "{comparison.candidateComment || comparison.expertComment}"
                              </blockquote>
                            )}

                          {/* Sources if available - candidate or expert */}
                          {((comparison.candidateSources && comparison.candidateSources.length > 0) ||
                            (comparison.expertSources && comparison.expertSources.length > 0) ||
                            comparison.candidateAnswer === null ||
                            comparison.candidateAnswer === undefined) && (
                            <div className="koa:text-xs koa:text-text-muted">
                              {(comparison.candidateAnswer === null || comparison.candidateAnswer === undefined) && respondent === "expert" ? (
                                <div className="koa:space-y-1">
                                  <div>
                                    <div className="koa:inline-flex koa:items-center koa:gap-1 koa:px-2 koa:py-1 koa:rounded koa:bg-surface-sunken koa:text-text-strong koa:text-xs">
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
                                          className="koa:inline-flex koa:items-center koa:gap-1 koa:px-2 koa:py-1 koa:rounded koa:bg-surface-sunken koa:hover:bg-surface-hover koa:text-text-strong koa:text-xs"
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
                                        <blockquote className="koa:text-text-muted koa:italic koa:pl-4 koa:border-l-2 koa:border-border koa:text-sm">
                                          {source.description || t("noDescription")}
                                          {source.url && (
                                            <>
                                              {" "}
                                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="koa:text-primary koa:hover:text-primary-hover koa:underline">
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
                                  ? "koa:bg-primary koa:text-on-bg-primary"
                                  : "koa:bg-secondary koa:text-on-bg-secondary"
                                : "koa:bg-transparent koa:text-text-muted"
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
