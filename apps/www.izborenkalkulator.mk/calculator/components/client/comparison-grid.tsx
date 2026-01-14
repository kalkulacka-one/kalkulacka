// TODO [TENANT-014]: Extract hardcoded Macedonian strings to i18n
import { type AnswersViewModel, ComparisonQuestionCard, type QuestionsViewModel, type ResultViewModel } from "@kalkulacka-one/app";
import { Icon } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@kalkulacka-one/design-system/icons";
import { IconBadge } from "@kalkulacka-one/design-system/server";

import { useState } from "react";

export type ComparisonGridDashlinesOverlay = {
  result: ResultViewModel;
  filterNestedCandidates: (nestedMatches: ResultViewModel["matches"][0]["nestedMatches"]) => ResultViewModel["matches"][0]["nestedMatches"];
};

function ComparisonGridDashlinesOverlay({ result, filterNestedCandidates }: ComparisonGridDashlinesOverlay) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        top: result.matches.some((match) => match.nestedMatches) ? "180px" : "0px",
      }}
    >
      <div className="h-full flex gap-8">
        {/* User column line - sticky */}
        <div className="w-[100px] flex justify-center sticky left-4">
          <div className="w-0 h-full border-r-2 border-dashed border-slate-200" />
        </div>
        {/* Candidate columns lines */}
        {result.matches.map((match, matchIndex) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            return (
              <div key={`line-${match.candidate.id}-${matchIndex}`} className="w-[100px] flex justify-center">
                <div className="w-0 h-full border-r-2 border-dashed border-slate-200" />
              </div>
            );
          }
          return (
            <div key={`line-group-${match.candidate.id}-${matchIndex}`} className="flex gap-8">
              {nestedMatches.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => (
                <div key={`line-${nested.candidate.id}-${matchIndex}`} className="w-[100px] flex justify-center">
                  <div className="w-0 h-full border-r-2 border-dashed border-slate-200" />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type OrganizationFilter = {
  organizations: string[];
  selectedOrganizations: Set<string>;
  setSelectedOrganizations: (organizations: Set<string>) => void;
};

function OrganizationFilter({ organizations, selectedOrganizations, setSelectedOrganizations }: OrganizationFilter) {
  if (organizations.length === 0) return null;

  return (
    <div className="sticky left-4 max-w-dvw z-10 flex flex-col gap-2">
      <h3 className="text-sm font-medium">Изберете партија:</h3>
      <div className="relative bg-slate-100 rounded-full p-1 flex flex-wrap gap-1 max-w-[90dvw] sm:w-fit">
        <label
          className={` text-xs px-4 py-2 rounded-full cursor-pointer transition-colors ${
            selectedOrganizations.size === 0 ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
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
          Избери сите
        </label>
        {organizations.map((org) => (
          <label
            key={org}
            className={`text-xs px-4 py-2 rounded-full cursor-pointer transition-colors ${
              selectedOrganizations.has(org) ? "bg-slate-700 text-slate-50" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
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
  );
}

export type ComparisonAnswerIcon = {
  answer: boolean | null | undefined;
};

function ComparisonAnswerIcon({ answer }: ComparisonAnswerIcon) {
  return (
    <IconBadge color={answer === null || answer === undefined ? "neutral" : answer ? "primary" : "secondary"}>
      <Icon decorative={true} icon={answer === null || answer === undefined ? logoSlash : answer ? logoCheck : logoCross} />
    </IconBadge>
  );
}

export type ComparisonHeader = {
  condensed?: boolean;
  result: ResultViewModel;
  filterNestedCandidates: (nestedMatches: ResultViewModel["matches"][0]["nestedMatches"]) => ResultViewModel["matches"][0]["nestedMatches"];
};

function ComparisonHeader({ condensed = false, result, filterNestedCandidates }: ComparisonHeader) {
  return (
    <div className={`sticky ${condensed ? "top-[4.75rem]" : "top-32"} gap-8 flex z-40 transition-all duration-500 ease-in-out`}>
      <div className="rounded-xl bg-blue-100/60 backdrop-blur-lg border-blue-50 border-1 z-50 min-h-[65px] sticky left-4 w-[100px] flex-shrink-0 text-center text-xs flex items-center justify-center">
        Вашите одговори
      </div>
      {result.matches.map((match, matchIndex) => {
        const nestedMatches = filterNestedCandidates(match.nestedMatches);
        const nestedCandidates = nestedMatches?.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => (
          <div
            key={`header-${nested.candidate.id}-${matchIndex}`}
            className=" rounded-xl bg-slate-100/60 backdrop-blur-lg border-slate-100 border-1 w-[100px] flex-shrink-0 flex items-center justify-center text-center text-xs"
          >
            <span>
              {nested.candidate.displayName}
              <br />({nested.candidate.organization})
            </span>
          </div>
        ));
        if (!nestedMatches) {
          return (
            <div
              key={`header-${match.candidate.id}-${matchIndex}`}
              className="rounded-xl bg-slate-100/60 backdrop-blur-lg border-slate-100 border-1 w-[100px] flex-shrink-0 flex items-center justify-center text-center text-xs"
            >
              {match.candidate.displayName}
            </div>
          );
        }
        return (
          <div key={`header-group-${match.candidate.id}-${matchIndex}`} className="flex gap-8">
            {nestedCandidates}
          </div>
        );
      })}
    </div>
  );
}

type ComparisonQuestionRow = {
  question: QuestionsViewModel["questions"][0];
  index: number;
  totalQuestions: number;
  answers: AnswersViewModel;
  result: ResultViewModel;
  filterNestedCandidates: (nestedMatches: ResultViewModel["matches"][0]["nestedMatches"]) => ResultViewModel["matches"][0]["nestedMatches"];
};

function ComparisonQuestionRow({ question, index, totalQuestions, answers, result, filterNestedCandidates }: ComparisonQuestionRow) {
  const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);

  return (
    <div key={question.id} className="flex flex-col gap-4 relative z-30">
      <div className="flex gap-8 relative w-max">
        <div className="h-auto absolute left-0 top-0" />
        <div className="px-4 flex justify-start sticky left-4 w-[95dvw]">
          <ComparisonQuestionCard question={question} current={index + 1} total={totalQuestions} />
        </div>
        <div className="w-[100px] flex-shrink-0" />
        {result.matches.map((match, matchIndex) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            return <div key={`spacer-${match.candidate.id}-${matchIndex}`} className="w-[100px] flex-shrink-0" />;
          }
          return (
            <div key={`spacer-group-${match.candidate.id}-${matchIndex}`} className="flex gap-8">
              {nestedMatches.map((nested) => (
                <div key={`spacer-${nested.candidate.id}-${matchIndex}`} className="w-[100px] flex-shrink-0" />
              ))}
            </div>
          );
        })}
      </div>

      {/* answers grid */}
      <div className="flex gap-8 relative">
        <div className="h-32 absolute left-0 top-0" />
        {/* user answers */}
        <div className="w-[100px] z-20 flex-shrink-0 flex justify-center items-center min-h-[40px] sticky left-4">
          <div className="rounded-full bg-slate-50">
            <ComparisonAnswerIcon answer={userAnswer?.answer?.answer} />
          </div>
        </div>
        {/* candidate answers */}
        {result.matches.map((match, matchIndex) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            const answer = match.candidateAnswers.find((a) => a.questionId === question.id);
            return (
              <div key={`answer-${match.candidate.id}-${matchIndex}`} className="w-[100px] flex-shrink-0 flex justify-center items-center min-h-[40px]">
                <ComparisonAnswerIcon answer={answer?.answer} />
              </div>
            );
          }
          return (
            <div key={`answer-group-${match.candidate.id}-${matchIndex}`} className="flex gap-8">
              {nestedMatches.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => {
                const answer = nested.candidateAnswers.find((a: (typeof nested.candidateAnswers)[0]) => a.questionId === question.id);
                return (
                  <div key={`answer-${nested.candidate.id}-${matchIndex}`} className="w-[100px] flex-shrink-0 flex justify-center items-center min-h-[40px]">
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
}

export type ComparisonGrid = {
  questions: QuestionsViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
  condensed?: boolean;
};

export function ComparisonGrid({ questions, answers, result, condensed = false }: ComparisonGrid) {
  const [selectedOrganizations, setSelectedOrganizations] = useState<Set<string>>(new Set());

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

  const filterNestedCandidates = (nestedMatches: (typeof result.matches)[0]["nestedMatches"]) => {
    if (!nestedMatches) return nestedMatches;
    if (selectedOrganizations.size === 0) return nestedMatches;
    return nestedMatches.filter((nested) => nested.candidate.organization && selectedOrganizations.has(nested.candidate.organization));
  };

  return (
    <div className="mt-28 flex flex-col gap-8 relative">
      <OrganizationFilter organizations={organizations} selectedOrganizations={selectedOrganizations} setSelectedOrganizations={setSelectedOrganizations} />
      <div className="mr-[calc(5dvw)] flex flex-col gap-8">
        <ComparisonGridDashlinesOverlay result={result} filterNestedCandidates={filterNestedCandidates} />
        <ComparisonHeader condensed={condensed} result={result} filterNestedCandidates={filterNestedCandidates} />
        {questions.questions.map((question, index) => (
          <ComparisonQuestionRow
            key={question.id}
            question={question}
            index={index}
            totalQuestions={questions.questions.length}
            answers={answers}
            result={result}
            filterNestedCandidates={filterNestedCandidates}
          />
        ))}
      </div>
    </div>
  );
}
