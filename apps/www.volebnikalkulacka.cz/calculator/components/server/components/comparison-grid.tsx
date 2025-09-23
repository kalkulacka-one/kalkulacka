"use client";
import { mdiChevronDown } from "@mdi/js";
import { Icon } from "@repo/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@repo/design-system/icons";
import { IconBadge } from "@repo/design-system/server";
import { twMerge } from "@repo/design-system/utils";
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

export type ComparisonGridChevron = {
  className?: string;
  open: boolean;
};

function ComparisonGridChevron({ className, open = false }: ComparisonGridChevron) {
  return <Icon icon={mdiChevronDown} className={twMerge(open ? "rotate-270" : "", className)} size="medium" decorative />;
}
export type ComparisonGrid = {
  questions: QuestionsViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
};

export function ComparisonGrid({ questions, answers, result }: ComparisonGrid) {
  // console.log(result.matches);
  const [expandedParties, setExpandedParties] = useState<Set<string>>(new Set());
  function toggleNested(id: string) {
    setExpandedParties((prevState) => {
      const newSet = new Set(prevState);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }
  return (
    <>
      {/* header */}
      <div className="mt-28 flex flex-col gap-8" style={{ minWidth: `${320 + result.matches.length * 80 + 4800}px` }}>
        <div className="sticky top-16 flex gap-4 bg-slate-50 z-20">
          <div className="bg-slate-50 z-20 min-h-fit sticky left-0 w-[100px] flex-shrink-0 text-center text-xs flex items-center justify-center">Vaše odpovědi</div>
          {/* dummy header for nested and normal */}
          {result.matches.map((match, matchIndex) => {
            const nestedMatches = match.nestedMatches;
            const nestedCandidates = nestedMatches?.map((nested) => (
              <div key={`header-${nested.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex items-center justify-center text-center text-xs">
                {nested.candidate.displayName}
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
                <button type="button" className="w-[120px] flex-shrink-0 flex items-center justify-center text-center text-xs" onClick={() => toggleNested(match.candidate.id)}>
                  {match.candidate.displayName}
                  <ComparisonGridChevron open={expandedParties.has(match.candidate.id)} />
                </button>
                {expandedParties.has(match.candidate.id) && nestedCandidates}
              </div>
            );
          })}
        </div>
        {questions.questions.map((question, index) => {
          const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
          return (
            <div key={question.id} className="flex flex-col gap-4">
              <ComparisonQuestionCard question={question} current={index + 1} total={questions.questions.length} />
              {/* answers grid */}
              <div className="flex gap-4">
                {/* user answers */}
                <div className="w-[100px] bg-slate-50  z-20 flex-shrink-0 flex justify-center items-center min-h-[40px] sticky left-0">
                  <ComparisonAnswerIcon answer={userAnswer?.answer?.answer} />
                </div>
                {/* candidate answers */}
                {result.matches.map((match, matchIndex) => {
                  const nestedMatches = match.nestedMatches;
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
                      <div className="w-[120px] flex-shrink-0 flex items-center justify-center text-center text-xs min-h-[40px]" />
                      {expandedParties.has(match.candidate.id) &&
                        nestedMatches.map((nested) => {
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
