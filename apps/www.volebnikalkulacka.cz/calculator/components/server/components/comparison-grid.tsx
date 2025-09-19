import { Icon } from "@repo/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@repo/design-system/icons";
import { IconBadge } from "@repo/design-system/server";

import type { AnswersViewModel, QuestionsViewModel, ResultViewModel } from "../../../view-models";
import { ComparisonQuestionCard } from "./comparison-question-card";

export type ComparisonGrid = {
  questions: QuestionsViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
};

export function ComparisonGrid({ questions, answers, result }: ComparisonGrid) {
  return (
    <>
      {/* header */}
      <div className="mt-28 flex flex-col gap-8" style={{ minWidth: `${320 + result.matches.length * 80 + 1600}px` }}>
        <div className="sticky top-16 flex gap-4 bg-slate-50 z-20">
          <div className="w-[100px] flex-shrink-0 text-center text-xs flex items-center justify-center">Vaše odpovědi</div>
          {result.matches.map((match, matchIndex) => (
            <div key={`header-${match.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex items-center justify-center text-center text-xs">
              {match.candidate.displayName}
            </div>
          ))}
        </div>
        {questions.questions.map((question, index) => {
          const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
          return (
            <div key={question.id} className="flex flex-col gap-4">
              <ComparisonQuestionCard question={question} current={index + 1} total={questions.questions.length} />
              {/* answers grid */}
              <div className="flex gap-4">
                {/* user answers */}
                <div className="w-[100px] flex-shrink-0 flex justify-center items-center min-h-[40px] sticky left-0">
                  {userAnswer ? (
                    <IconBadge color={userAnswer.answer?.answer === true ? "primary" : "secondary"}>
                      <Icon decorative={true} icon={userAnswer.answer?.answer === true ? logoCheck : logoCross} />
                    </IconBadge>
                  ) : (
                    <IconBadge color="neutral">
                      <Icon decorative={true} icon={logoSlash} />
                    </IconBadge>
                  )}
                </div>
                {/* candidate answers */}
                {result.matches.map((match, matchIndex) => {
                  const answer = match.candidateAnswers.find((a) => a.questionId === question.id);
                  return (
                    <div key={`answer-${match.candidate.id}-${matchIndex}`} className="w-[80px] flex-shrink-0 flex justify-center items-center min-h-[40px]">
                      {answer && answer.answer !== null && answer.answer !== undefined ? (
                        <IconBadge color={answer.answer === true ? "primary" : "secondary"}>
                          <Icon decorative={true} icon={answer.answer === true ? logoCheck : logoCross} />
                        </IconBadge>
                      ) : (
                        <IconBadge color="neutral">
                          <Icon decorative={true} icon={logoSlash} />
                        </IconBadge>
                      )}
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
