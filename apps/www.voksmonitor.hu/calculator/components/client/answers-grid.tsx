import { Icon } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@kalkulacka-one/design-system/icons";
import { Card, IconBadge } from "@kalkulacka-one/design-system/server";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type { CandidateAnswerViewModel, CandidatesAnswersViewModel, CandidateViewModel, QuestionsViewModel, QuestionViewModel } from "../../view-models";

function AnswersQuestionCard({ question }: { question: QuestionViewModel }) {
  return (
    <Card corner="topLeft" shadow="hard" className="border border-slate-200 w-fit">
      <div className="p-3 sm:p-6 flex flex-col gap-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-700 leading-tight tracking-tighter break-words">{question.statement}</h3>
      </div>
    </Card>
  );
}

const COMMENT_PREVIEW_LENGTH = 120;

type AnswerIconProps = {
  answer: boolean | null | undefined;
};

function AnswerIcon({ answer }: AnswerIconProps) {
  if (answer === undefined) {
    return (
      <IconBadge color="neutral">
        <span className="p-3" />
      </IconBadge>
    );
  }
  return (
    <IconBadge color={answer === null ? "neutral" : answer ? "primary" : "secondary"}>
      <Icon decorative={true} icon={answer === null ? logoSlash : answer ? logoCheck : logoCross} />
    </IconBadge>
  );
}

type ExpandableCommentProps = {
  comment?: string;
  sources?: { url: string; title?: string }[];
  cellKey: string;
  expandedComments: Set<string>;
  toggleComment: (cellKey: string) => void;
};

function ExpandableComment({ comment, sources, cellKey, expandedComments, toggleComment }: ExpandableCommentProps) {
  const t = useTranslations("calculator.comparison");
  const normalizedComment = comment?.trim();
  const hasSources = sources && sources.length > 0;
  if (!normalizedComment && !hasSources) return null;

  const isLong = normalizedComment ? normalizedComment.length > COMMENT_PREVIEW_LENGTH : false;
  const isExpanded = expandedComments.has(cellKey);
  const preview = normalizedComment && isLong ? `${normalizedComment.slice(0, COMMENT_PREVIEW_LENGTH)}...` : normalizedComment;
  const textToRender = isExpanded ? normalizedComment : preview;

  const sourceLinks = hasSources ? (
    <div className="flex flex-wrap justify-center gap-1 mt-1">
      {sources.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[9px] text-blue-600 hover:text-blue-800 underline">
          {source.title || source.url}
          <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
          </svg>
        </a>
      ))}
    </div>
  ) : null;

  if (!normalizedComment) {
    return sourceLinks;
  }

  if (!isLong) {
    return (
      <div>
        <p className="text-[10px] leading-4 text-center text-gray-700 break-words">{textToRender}</p>
        {sourceLinks}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="text-[10px] leading-4 text-center text-gray-700 break-words cursor-pointer hover:text-gray-900 transition-colors hyphens-auto"
        onClick={() => toggleComment(cellKey)}
        aria-expanded={isExpanded}
      >
        {textToRender} {!isExpanded && <span className="text-gray-700 font-bold ml-1">{t("read-more")}</span>}
      </button>
      {sourceLinks}
    </div>
  );
}

type AnswersHeaderProps = {
  condensed?: boolean;
  candidates: CandidateViewModel[];
};

function AnswersHeader({ condensed = false, candidates }: AnswersHeaderProps) {
  return (
    <div className={`sticky ${condensed ? "top-[4.75rem]" : "top-32"} gap-8 flex z-40 transition-all duration-500 ease-in-out`}>
      {candidates.map((candidate) => (
        <div
          key={`header-${candidate.id}`}
          className="rounded-xl bg-gray-100/60 backdrop-blur-lg border-gray-100 border-1 w-[200px] flex-shrink-0 flex items-center justify-center text-center text-xs min-h-[65px]"
        >
          {candidate.displayName}
        </div>
      ))}
    </div>
  );
}

type AnswersDashlinesOverlayProps = {
  candidates: CandidateViewModel[];
};

function AnswersDashlinesOverlay({ candidates }: AnswersDashlinesOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0" style={{ top: "0px" }}>
      <div className="h-full flex gap-8">
        {candidates.map((candidate) => (
          <div key={`line-${candidate.id}`} className="w-[200px] flex justify-center">
            <div className="w-0 h-full border-r-2 border-dashed border-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

type AnswersQuestionRowProps = {
  question: QuestionViewModel;
  candidates: CandidateViewModel[];
  candidatesAnswers: CandidatesAnswersViewModel;
};

function AnswersQuestionRow({ question, candidates, candidatesAnswers }: AnswersQuestionRowProps) {
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleComment = (cellKey: string) => {
    setExpandedComments((current) => {
      const updated = new Set(current);
      if (updated.has(cellKey)) {
        updated.delete(cellKey);
      } else {
        updated.add(cellKey);
      }
      return updated;
    });
  };

  return (
    <div key={question.id} className="flex flex-col gap-4 relative z-30">
      <div className="flex gap-8 relative w-max">
        <div className="px-4 flex justify-start sticky left-4 w-[95dvw]">
          <AnswersQuestionCard question={question} />
        </div>
        {candidates.map((candidate) => (
          <div key={`spacer-${candidate.id}`} className="w-[200px] flex-shrink-0" />
        ))}
      </div>

      <div className="flex gap-8 relative">
        {candidates.map((candidate) => {
          const answers: CandidateAnswerViewModel[] = candidatesAnswers[candidate.id] ?? [];
          const answer = answers.find((a) => a.questionId === question.id);
          return (
            <div key={`answer-${candidate.id}`} className="w-[200px] flex-shrink-0 flex flex-col justify-center items-center min-h-[40px] gap-1">
              <AnswerIcon answer={answer?.answer} />
              <ExpandableComment comment={answer?.comment} sources={answer?.sources} cellKey={`${question.id}-${candidate.id}`} expandedComments={expandedComments} toggleComment={toggleComment} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TagGroup = {
  tag: string;
  questions: { question: QuestionViewModel }[];
};

function groupQuestionsByTag(questions: QuestionViewModel[]): TagGroup[] {
  const groups: TagGroup[] = [];
  const groupsByTag = new Map<string, TagGroup>();

  for (const question of questions) {
    const tag = question.tags?.[0] ?? "";
    let group = groupsByTag.get(tag);
    if (!group) {
      group = { tag, questions: [] };
      groupsByTag.set(tag, group);
      groups.push(group);
    }
    group.questions.push({ question });
  }

  return groups;
}

export type AnswersGrid = {
  questions: QuestionsViewModel;
  candidates: CandidateViewModel[];
  candidatesAnswers: CandidatesAnswersViewModel;
  condensed?: boolean;
};

export function AnswersGrid({ questions, candidates, candidatesAnswers, condensed = false }: AnswersGrid) {
  const groups = groupQuestionsByTag(questions.questions);

  return (
    <div className="mt-28 flex flex-col gap-8 relative">
      <div className="mr-[calc(5dvw)] flex flex-col gap-8">
        <AnswersDashlinesOverlay candidates={candidates} />
        <AnswersHeader condensed={condensed} candidates={candidates} />
        {groups.map((group) => (
          <div key={`group-${group.tag || "untagged"}`} className="flex flex-col gap-8">
            {group.tag && (
              <div className="sticky left-4 w-[95dvw] z-20">
                <h3 className="font-display font-semibold text-xl tracking-tight text-gray-700 px-4 py-2 bg-gray-50/90 backdrop-blur-sm rounded-md inline-block">{group.tag}</h3>
              </div>
            )}
            {group.questions.map(({ question }) => (
              <AnswersQuestionRow key={question.id} question={question} candidates={candidates} candidatesAnswers={candidatesAnswers} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
