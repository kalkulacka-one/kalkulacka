"use client";
import {
  ArrowIconLeft,
  ArrowIconRight,
  PercentageIcon,
} from "@repo/design-system/icons";
import { Button, RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../providers/storeProvider";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  useEffect(() => {
    // rerender on change of answertype of isImportant
  }, [questions]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* rekapitulace header */}
      {/* sticky not working when scrolling over some portion of h */}
      <header className="sticky top-0 grid w-full grid-cols-[auto_1fr_auto] items-center gap-2 bg-white p-2  sm:gap-8 sm:p-8">
        {/* fix link wrap, should be link in style of a button! */}
        {/*Link to the last question "current quesiton" */}
        <div className="flex items-center  justify-self-start">
          <Link className="flex items-center" href="/abc/otazka/1">
            <Button
              hasIcon
              icon={ArrowIconLeft}
              iconPosition="left"
              kind="link"
              fitContent
              size="auto"
            />
          </Link>
        </div>

        {/* replace with typo compoment */}
        <div className="justify-self-center sm:mr-auto">
          <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
            Rekapitulace
          </h2>
        </div>

        {/* twmerge button fix here */}
        <div className="hidden sm:block sm:justify-self-end">
          {/* fix link wrap, should be link in style of a button! */}
          <Link href="/abc/vysledky">
            <Button
              hasIcon
              kind="filled"
              size="default"
              color="primary"
              iconPosition="right"
              fitContent
              icon={ArrowIconRight}
            >
              <div className="flex">
                {/* margin or gap? */}
                <PercentageIcon className="mr-4 size-6" />
                Zobrazit výsledky
              </div>
            </Button>
          </Link>
        </div>
      </header>
      {/* main content */}
      <main className="grid grid-cols-1 justify-center gap-4 p-4 min-[701px]:grid-cols-[clamp(32rem,50vw,48rem)]">
        {/* grid col 1 */}
        {/* replace with typo compoment */}
        <p className="text-sm leading-tight text-neutral">
          Zde si můžete projít a případně upravit svoje odpovědi a jejich váhu.
        </p>
        <div className="flex flex-col items-start gap-4">
          {questions.map((question, index) => {
            const currentQuestion = index + 1;
            return (
              <RecapitulationCard
                key={`Recapitulation card id:${question.id}`}
                currentQuestion={currentQuestion}
                questionCount={questions.length}
                question={question}
                yesPressed={question.answerType === true ? true : undefined}
                noPressed={question.answerType === false ? true : undefined}
                starPressed={question.isImportant ? true : undefined}
                onClick={(buttonType) => {
                  if (buttonType === "toggleImportant") {
                    toggleImportant(index + 1);
                  } else if (buttonType === "Yes") {
                    answerYes(index + 1);
                  } else if (buttonType === "No") {
                    answerNo(index + 1);
                  }
                }}
              />
            );
          })}
        </div>
      </main>
      {/* bottom bar */}
      <div className="sticky bottom-0 bg-white p-4 sm:hidden">
        {/* fix link wrap, should be link in style of a button! */}
        <Link href="/abc/vysledky">
          <Button
            hasIcon
            kind="filled"
            size="default"
            color="primary"
            iconPosition="right"
            icon={ArrowIconRight}
          >
            Zobrazit výsledky
          </Button>
        </Link>
      </div>
    </div>
  );
}

// TODO:
// 1. ButtonToggle does not rerender state
