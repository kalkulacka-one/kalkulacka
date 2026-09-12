import { Icon } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@kalkulacka-one/design-system/icons";
import { IconBadge } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { ComparisonQuestionCard } from "@/components/comparison-question-card";
import type { AnswersViewModel, QuestionsViewModel, ResultViewModel } from "@/view-models";

export type ComparisonGridDashlinesOverlay = {
  result: ResultViewModel;
  filterNestedCandidates: (nestedMatches: ResultViewModel["matches"][0]["nestedMatches"]) => ResultViewModel["matches"][0]["nestedMatches"];
};

function ComparisonGridDashlinesOverlay({ result, filterNestedCandidates }: ComparisonGridDashlinesOverlay) {
  return (
    <div
      className="koa:absolute koa:inset-0 koa:pointer-events-none koa:z-0"
      style={{
        top: result.matches.some((match) => match.nestedMatches) ? "180px" : "0px",
      }}
    >
      <div className="koa:h-full koa:flex koa:gap-8">
        {/* User column line - sticky */}
        <div className="koa:w-[100px] koa:flex koa:justify-center koa:sticky koa:left-4">
          <div className="koa:w-0 koa:h-full koa:border-r-2 koa:border-dashed koa:border-slate-200" />
        </div>
        {/* Candidate columns lines */}
        {result.matches.map((match) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            return (
              <div key={`line-${match.candidate.id}`} className="koa:w-[100px] koa:flex koa:justify-center">
                <div className="koa:w-0 koa:h-full koa:border-r-2 koa:border-dashed koa:border-slate-200" />
              </div>
            );
          }
          return (
            <div key={`line-group-${match.candidate.id}`} className="koa:flex koa:gap-8">
              {nestedMatches.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => (
                <div key={`line-${nested.candidate.id}`} className="koa:w-[100px] koa:flex koa:justify-center">
                  <div className="koa:w-0 koa:h-full koa:border-r-2 koa:border-dashed koa:border-slate-200" />
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
  const t = useTranslations("koa.components.comparisonGrid");

  if (organizations.length === 0) return null;

  return (
    <div className="koa:sticky koa:left-4 koa:max-w-dvw koa:z-10 koa:flex koa:flex-col koa:gap-2">
      <h3 className="koa:text-sm koa:font-medium">{t("selectParty")}</h3>
      <div className="koa:relative koa:bg-slate-100 koa:rounded-full koa:p-1 koa:flex koa:flex-wrap koa:gap-1 koa:max-w-[90dvw] koa:sm:w-fit">
        <label
          className={` koa:text-xs koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${
            selectedOrganizations.size === 0 ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"
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
            className="koa:sr-only"
          />
          {t("selectAll")}
        </label>
        {organizations.map((org) => (
          <label
            key={org}
            className={`koa:text-xs koa:px-4 koa:py-2 koa:rounded-full koa:cursor-pointer koa:transition-colors ${
              selectedOrganizations.has(org) ? "koa:bg-slate-700 koa:text-slate-50" : "koa:bg-slate-100 koa:text-slate-700 koa:hover:bg-slate-200"
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
              className="koa:sr-only"
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
  const t = useTranslations("koa.components.comparisonGrid");

  return (
    <div className={`koa:sticky ${condensed ? "koa:top-[4.75rem]" : "koa:top-32"} koa:gap-8 koa:flex koa:z-40 koa:transition-all koa:duration-500 koa:ease-in-out`}>
      <div className="koa:rounded-xl koa:bg-blue-100/60 koa:backdrop-blur-lg koa:border-blue-50 koa:border-1 koa:z-50 koa:min-h-[65px] koa:sticky koa:left-4 koa:w-[100px] koa:flex-shrink-0 koa:text-center koa:text-xs koa:flex koa:items-center koa:justify-center">
        {t("yourAnswers")}
      </div>
      {result.matches.map((match) => {
        const nestedMatches = filterNestedCandidates(match.nestedMatches);
        const nestedCandidates = nestedMatches?.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => (
          <div
            key={`header-${nested.candidate.id}`}
            className=" koa:rounded-xl koa:bg-slate-100/60 koa:backdrop-blur-lg koa:border-slate-100 koa:border-1 koa:w-[100px] koa:flex-shrink-0 koa:flex koa:items-center koa:justify-center koa:text-center koa:text-xs"
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
              key={`header-${match.candidate.id}`}
              className="koa:rounded-xl koa:bg-slate-100/60 koa:backdrop-blur-lg koa:border-slate-100 koa:border-1 koa:w-[100px] koa:flex-shrink-0 koa:flex koa:items-center koa:justify-center koa:text-center koa:text-xs"
            >
              {match.candidate.displayName}
            </div>
          );
        }
        return (
          <div key={`header-group-${match.candidate.id}`} className="koa:flex koa:gap-8">
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
    <div key={question.id} className="koa:flex koa:flex-col koa:gap-4 koa:relative koa:z-30">
      <div className="koa:flex koa:gap-8 koa:relative koa:w-max">
        <div className="koa:h-auto koa:absolute koa:left-0 koa:top-0" />
        <div className="koa:px-4 koa:flex koa:justify-start koa:sticky koa:left-4 koa:w-[95dvw]">
          <ComparisonQuestionCard question={question} current={index + 1} total={totalQuestions} />
        </div>
        <div className="koa:w-[100px] koa:flex-shrink-0" />
        {result.matches.map((match) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            return <div key={`spacer-${match.candidate.id}`} className="koa:w-[100px] koa:flex-shrink-0" />;
          }
          return (
            <div key={`spacer-group-${match.candidate.id}`} className="koa:flex koa:gap-8">
              {nestedMatches.map((nested) => (
                <div key={`spacer-${nested.candidate.id}`} className="koa:w-[100px] koa:flex-shrink-0" />
              ))}
            </div>
          );
        })}
      </div>

      {/* answers grid */}
      <div className="koa:flex koa:gap-8 koa:relative">
        <div className="koa:h-32 koa:absolute koa:left-0 koa:top-0" />
        {/* user answers */}
        <div className="koa:w-[100px] koa:z-20 koa:flex-shrink-0 koa:flex koa:justify-center koa:items-center koa:min-h-[40px] koa:sticky koa:left-4">
          <div className="koa:rounded-full koa:bg-slate-50">
            <ComparisonAnswerIcon answer={userAnswer?.answer?.answer} />
          </div>
        </div>
        {/* candidate answers */}
        {result.matches.map((match) => {
          const nestedMatches = filterNestedCandidates(match.nestedMatches);
          if (!nestedMatches) {
            const answer = match.candidateAnswers.find((a) => a.questionId === question.id);
            return (
              <div key={`answer-${match.candidate.id}`} className="koa:w-[100px] koa:flex-shrink-0 koa:flex koa:justify-center koa:items-center koa:min-h-[40px]">
                <ComparisonAnswerIcon answer={answer?.answer} />
              </div>
            );
          }
          return (
            <div key={`answer-group-${match.candidate.id}`} className="koa:flex koa:gap-8">
              {nestedMatches.map((nested: NonNullable<ResultViewModel["matches"][0]["nestedMatches"]>[0]) => {
                const answer = nested.candidateAnswers.find((a: (typeof nested.candidateAnswers)[0]) => a.questionId === question.id);
                return (
                  <div key={`answer-${nested.candidate.id}`} className="koa:w-[100px] koa:flex-shrink-0 koa:flex koa:justify-center koa:items-center koa:min-h-[40px]">
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
    <div className="koa:mt-28 koa:flex koa:flex-col koa:gap-8 koa:relative">
      <OrganizationFilter organizations={organizations} selectedOrganizations={selectedOrganizations} setSelectedOrganizations={setSelectedOrganizations} />
      <div className="koa:mr-[calc(5dvw)] koa:flex koa:flex-col koa:gap-8">
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
