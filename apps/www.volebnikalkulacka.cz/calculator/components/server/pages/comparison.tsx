import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@repo/design-system/icons";
import { IconBadge } from "@repo/design-system/server";

import { HideOnEmbed } from "../../../../components/client";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel, ResultViewModel } from "../../../view-models";
import { AppHeader, WithCondenseOnScroll } from "../../client";
import { ComparisonQuestionCard, Layout } from "../components";

export type ComparisonPage = {
  calculator: CalculatorViewModel;
  result: ResultViewModel;
  answers: AnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  attribution?: boolean;
};

export function ComparisonPage({ calculator, result, onPreviousClick, onCloseClick, questions, answers }: ComparisonPage) {
  return (
    <>
      <Layout.Header>
        <WithCondenseOnScroll>
          {(condensed) => (
            <AppHeader condensed={condensed} calculator={calculator}>
              <AppHeader.Right>
                <HideOnEmbed>
                  <Button variant="link" color="neutral" size="small" aria-label="Close" onClick={onCloseClick}>
                    <Icon icon={mdiClose} size="medium" decorative />
                  </Button>
                </HideOnEmbed>
              </AppHeader.Right>
              <AppHeader.Bottom>
                <AppHeader.BottomLeft condensed={condensed}>
                  <Button variant="link" color="neutral" size="small" onClick={onPreviousClick} aria-label="Zpět na výsledky">
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                </AppHeader.BottomLeft>
                <AppHeader.BottomMain condensed={condensed}>
                  <h3 className="font-display font-semibold text-2xl tracking-tight text-slate-700">Porovnání</h3>
                </AppHeader.BottomMain>
              </AppHeader.Bottom>
            </AppHeader>
          )}
        </WithCondenseOnScroll>
      </Layout.Header>
      <Layout.Content>
        <div className="flex">
          <div className="grid gap-8">
            {questions.questions.map((question, index) => {
              const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
              return (
                <div key={question.id} className="flex flex-col gap-4">
                  <ComparisonQuestionCard question={question} current={index + 1} total={questions.questions.length} />
                  {/* answers grid */}
                  <div className="grid gap-4" style={{ gridTemplateColumns: `400px repeat(${result.matches.length}, 80px)` }}>
                    {/* user answers */}
                    <div className="flex justify-center items-center min-h-[40px] sticky left-0">
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
                        <div key={`answer-${match.candidate.id}-${matchIndex}`} className="flex justify-center items-center min-h-[40px]">
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
        </div>
      </Layout.Content>
    </>
  );
}
