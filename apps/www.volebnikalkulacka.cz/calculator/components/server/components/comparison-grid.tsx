"use client";
import { Icon } from "@repo/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@repo/design-system/icons";
import { IconBadge } from "@repo/design-system/server";
import { useState } from "react";

import type { AnswersViewModel, QuestionsViewModel, ResultViewModel } from "../../../view-models";
import { ComparisonQuestionCard } from "./comparison-question-card";

function ComparisonAnswerIcon({ answer }: { answer: boolean | null | undefined }) {
  return (
    <IconBadge color={answer === null || answer === undefined ? "neutral" : answer ? "primary" : "secondary"}>
      <Icon decorative={true} icon={answer === null || answer === undefined ? logoSlash : answer ? logoCheck : logoCross} />
    </IconBadge>
  );
}

export type ComparisonGrid = {
  questions: QuestionsViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
};

export function ComparisonGrid({ questions, answers, result }: ComparisonGrid) {
  // Extract unique organizations from nested candidates
  const allOrganizations = new Set<string>();
  for (const match of result.matches) {
    if (match.nestedMatches) {
      for (const nested of match.nestedMatches) {
        if (nested.candidate.organization) {
          allOrganizations.add(nested.candidate.organization);
        }
      }
    }
  }

  const organizations = Array.from(allOrganizations);
  const [selectedOrganizations, setSelectedOrganizations] = useState<Set<string>>(new Set());

  // Filter function for nested candidates
  const filterNestedCandidates = (nestedMatches: (typeof result.matches)[0]["nestedMatches"]) => {
    if (!nestedMatches) return nestedMatches;
    if (selectedOrganizations.size === 0) return nestedMatches;
    return nestedMatches.filter((nested) => nested.candidate.organization && selectedOrganizations.has(nested.candidate.organization));
  };

  return (
    <>
      {/* Organization filter */}
      <div className={`${result.matches.some((match) => match.nestedMatches) ? "mt-16" : "mt-28"} flex flex-col gap-8 relative`} style={{ minWidth: `${320 + result.matches.length * 80 + 3600}px` }}>
        {/* Background dashed lines */}
        {result.matches.some((match) => match.nestedMatches) && (
          <div aria-hidden className="pointer-events-none absolute z-0 sm:hidden" style={{ top: "220px", bottom: "0" }}>
            <div className="h-full flex gap-4">
              {/* User answers column line - sticky */}
              <div className="w-[100px] sticky left-0">
                <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
              </div>
              {/* Candidate columns */}
              {result.matches.map((match, matchIndex) => {
                const nestedMatches = filterNestedCandidates(match.nestedMatches);
                if (!nestedMatches) {
                  return (
                    <div key={`bg-line-mobile-${match.candidate.id}-${matchIndex}`} className="w-[80px] relative">
                      <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
                    </div>
                  );
                }
                return (
                  <div key={`bg-line-mobile-group-${match.candidate.id}-${matchIndex}`} className="flex">
                    {nestedMatches.map((nested) => (
                      <div key={`bg-line-mobile-${nested.candidate.id}-${matchIndex}`} className="w-[80px] relative">
                        <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Background dashed lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 hidden sm:block"
          style={{
            top: result.matches.some((match) => match.nestedMatches) ? "180px" : "0",
            bottom: "0",
          }}
        >
          <div className="h-full flex gap-4">
            {/* User answers column line - sticky */}
            <div className="w-[100px] sticky left-0">
              <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
            </div>
            {/* Candidate columns */}
            {result.matches.map((match, matchIndex) => {
              const nestedMatches = filterNestedCandidates(match.nestedMatches);
              if (!nestedMatches) {
                return (
                  <div key={`bg-line-desktop-${match.candidate.id}-${matchIndex}`} className="w-[80px] relative">
                    <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
                  </div>
                );
              }
              return (
                <div key={`bg-line-desktop-group-${match.candidate.id}-${matchIndex}`} className="flex">
                  {nestedMatches.map((nested) => (
                    <div key={`bg-line-desktop-${nested.candidate.id}-${matchIndex}`} className="w-[80px] relative">
                      <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Background dashed lines - Non-nested version (all screen sizes) */}
        {!result.matches.some((match) => match.nestedMatches) && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <div className="h-full flex gap-4">
              {/* User answers column line - sticky */}
              <div className="w-[100px] sticky left-0">
                <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
              </div>
              {/* Candidate columns */}
              {result.matches.map((match, matchIndex) => (
                <div key={`bg-line-simple-${match.candidate.id}-${matchIndex}`} className="w-[80px] relative">
                  <div className="absolute inset-y-0 left-1/2 border-r-2 border-dashed border-slate-200" />
                </div>
              ))}
            </div>
          </div>
        )}
        {organizations.length > 0 && (
          <div className="mt-16 sticky left-0 max-w-fit z-10">
            <h3 className="text-sm font-medium mb-3">Vyberte stranu:</h3>
            <div className="relative bg-slate-100 rounded-full p-1 flex flex-wrap gap-1 max-w-dvw sm:w-auto">
              <label
                className={` text-xs px-4 py-2 rounded-full cursor-pointer transition-colors ${selectedOrganizations.size === 0 ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                <input
                  type="checkbox"
                  checked={selectedOrganizations.size === 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrganizations(new Set());
                    } else {
                      setSelectedOrganizations(new Set(organizations));
                    }
                  }}
                  className="sr-only"
                />
                Vybrat vše
              </label>
              {organizations.map((org) => (
                <label
                  key={org}
                  className={`text-xs px-4 py-2 rounded-full cursor-pointer transition-colors ${selectedOrganizations.has(org) ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedOrganizations.has(org)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedOrganizations);
                      if (e.target.checked) {
                        newSelected.add(org);
                      } else {
                        newSelected.delete(org);
                      }
                      setSelectedOrganizations(newSelected);
                    }}
                    className="sr-only"
                  />
                  {org}
                </label>
              ))}
            </div>
          </div>
        )}
        {/* header */}
        <div className="sticky top-16 flex gap-4 bg-slate-50 z-30">
          <div className="bg-slate-50 min-h-fit sticky left-0 w-[100px] flex-shrink-0 text-center text-xs flex items-center justify-center">Vaše odpovědi</div>
          {/* dummy header for nested and normal */}
          {result.matches.map((match, matchIndex) => {
            const nestedMatches = filterNestedCandidates(match.nestedMatches);
            const nestedCandidates = nestedMatches?.map((nested) => (
              <div key={`header-${nested.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex items-center justify-center text-center text-xs">
                <span>
                  {nested.candidate.displayName}
                  <br />({nested.candidate.organization})
                </span>
              </div>
            ));
            if (!nestedMatches) {
              return (
                <div key={`header-${match.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex items-center justify-center text-center text-xs">
                  {match.candidate.displayName}
                </div>
              );
            }
            return (
              <div key={`header-group-${match.candidate.id}-${matchIndex}`} className="flex">
                {nestedCandidates}
              </div>
            );
          })}
        </div>
        {questions.questions.map((question, index) => {
          const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
          return (
            <div key={question.id} className="flex flex-col gap-4 relative z-10">
              <ComparisonQuestionCard question={question} current={index + 1} total={questions.questions.length} />
              {/* answers grid */}
              <div className="flex gap-4">
                {/* user answers */}
                <div className="w-[100px] bg-slate-50  z-20 flex-shrink-0 flex justify-center items-center min-h-[40px] sticky left-0">
                  <ComparisonAnswerIcon answer={userAnswer?.answer?.answer} />
                </div>
                {/* candidate answers */}
                {result.matches.map((match, matchIndex) => {
                  const nestedMatches = filterNestedCandidates(match.nestedMatches);
                  if (!nestedMatches) {
                    const answer = match.candidateAnswers.find((a) => a.questionId === question.id);
                    return (
                      <div key={`answer-${match.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex justify-center items-center min-h-[40px]">
                        <ComparisonAnswerIcon answer={answer?.answer} />
                      </div>
                    );
                  }
                  return (
                    <div key={`answer-group-${match.candidate.id}-${matchIndex}`} className="flex">
                      {nestedMatches.map((nested) => {
                        const answer = nested.candidateAnswers.find((a) => a.questionId === question.id);
                        return (
                          <div key={`answer-${nested.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex justify-center items-center min-h-[40px]">
                            <ComparisonAnswerIcon answer={answer?.answer} />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
