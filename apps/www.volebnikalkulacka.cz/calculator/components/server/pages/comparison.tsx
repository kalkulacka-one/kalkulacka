import { mdiArrowLeft, mdiClose } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import { logoCheck, logoCross, logoSlash } from "@repo/design-system/icons";
import { IconBadge } from "@repo/design-system/server";

import { HideOnEmbed } from "../../../../components/client";
import type { AnswersViewModel, CalculatorViewModel, QuestionsViewModel } from "../../../view-models";
import { AppHeader, WithCondenseOnScroll } from "../../client";
import { ComparisonQuestionCard, LayoutContent, LayoutHeader } from "../components";

export type ComparisonPage = {
  calculator: CalculatorViewModel;
  answers: AnswersViewModel;
  questions: QuestionsViewModel;
  onPreviousClick: () => void;
  onCloseClick: () => void;
  attribution?: boolean;
};

export function ComparisonPage({ calculator, onPreviousClick, onCloseClick, questions, answers }: ComparisonPage) {
  console.log("Questions", questions.questions);
  return (
    <>
      <LayoutHeader>
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
      </LayoutHeader>
      <LayoutContent>
        <div className="flex">
          <div className="grid gap-8">
            {questions.questions.map((question, index) => {
              const userAnswer = answers.answers.find((answer) => answer.answer?.questionId === question.id);
              return (
                <div className="grid grid-cols-2 place-items-center" key={question.id}>
                  <div>
                    <ComparisonQuestionCard current={index + 1} total={questions.total} question={question} />
                  </div>
                  <div>
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
                </div>
              );
            })}
          </div>
        </div>
      </LayoutContent>
    </>
  );
}
