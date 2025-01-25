"use client";

import { BottomBar, Button, QuestionWrapper } from "@repo/design-system/ui";
import { useQuestionsStore } from "../../providers/storeProvider";
import { Question } from "@repo/schema/dist";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import Link from "next/link";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

export default function Page() {
  const params = useParams();
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const setCurrentQuestion = useQuestionsStore(
    (state) => state.setCurrentQuestion,
  );
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  // ** NEEEDS REFACTOR!
  useEffect(() => {
    const number = Number(params.questionNumber);
    if (number > 1 && number <= questions.length) {
      setCurrentQuestion(Number(params.questionNumber));
    } else {
      setCurrentQuestion(1);
    }
  }, []);

  return (
    <main className="relative flex flex-1 flex-col">
      {/* mobile navigation wrapper wrapper */}
      <div className="k1-sticky k1-top-0 k1-flex k1-w-dvw k1-justify-between sm:k1-hidden p-2 xs:p-4">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          size="auto"
          onClick={prevQuestion}
        >
          {currentQuestion === 1 ? (
            <Link href="/abc/navod/1">Návod</Link>
          ) : (
            "Předchozí"
          )}
        </Button>
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          kind="link"
          size="auto"
          fitContent
          onClick={skipQuestion}
        >
          {currentQuestion >= questions.length ? (
            <Link href="/abc/rekapitulace">Rekapitulace</Link>
          ) : (
            "Přeskočit"
          )}
        </Button>
      </div>
      <div className="flex flex-1 items-start justify-center min-[576px]:items-center">
        {/* questions wrapper */}
        {questions.map((question: ExtendedQuestions, index) => {
          if (currentQuestion === index + 1) {
            return (
              <QuestionWrapper
                key={`Question card id:${question.id}`}
                question={question}
                currentQuestion={currentQuestion}
                questionCount={questions.length}
                skipQuestion={skipQuestion}
                prevQuestion={prevQuestion}
              />
            );
          }
        })}
      </div>
      {/* Bottom bar wrapper */}
      {questions.map((question: ExtendedQuestions, index) => {
        if (currentQuestion === index + 1) {
          return (
            <BottomBar
              key={question.id}
              questions={questions}
              currentQuestion={currentQuestion}
              questionTotal={questions.length}
              toggleImportant={() => toggleImportant(currentQuestion)}
              // solve redirect !!!
              yesClick={() => {
                if (currentQuestion === questions.length) {
                  answerYes(currentQuestion);
                  console.log("Redirect here!");
                } else {
                  answerYes(currentQuestion);
                }
              }}
              noClick={() => answerNo(currentQuestion)}
              yesPressed={question.answerType === true ? true : undefined}
              noPressed={question.answerType === false ? true : undefined}
              starPressed={question.isImportant ? true : undefined}
            />
          );
        }
      })}
    </main>
  );
}

// TODO:
// 1. solve installHookJsError (see screenshot)
