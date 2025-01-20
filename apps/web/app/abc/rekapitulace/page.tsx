"use client";
import {
  ArrowIconLeft,
  ArrowIconRight,
  PercentageIcon,
} from "@repo/design-system/icons";
import { Button, RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../providers/storeProvider";
import Link from "next/link";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  return (
    <>
      {/* rekapitulace header */}
      {/* sticky not working when scrolling over some portion of h */}
      <header className="sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-8 bg-white p-4 sm:justify-center sm:p-8">
        {/* fix link wrap, should be link in style of a button! */}
        {/*Link to the last question "current quesiton" */}
        <Link href="/abc/otazka/1">
          <Button
            hasIcon
            icon={ArrowIconLeft}
            iconPosition="left"
            kind="link"
            fitContent
            size="auto"
          />
        </Link>

        {/* replace with typo compoment */}
        <h2 className="text-5xl  font-bold tracking-snug text-neutral-strong sm:mr-auto">
          Rekapitulace
        </h2>
        {/* twmerge button fix here */}
        <div className="hidden sm:block">
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
      <main className="grid grid-cols-[clamp(32rem,50vw,48rem)] justify-center gap-4 p-4">
        {/* grid col 1 */}
        {/* replace with typo compoment */}
        <p className="text-sm leading-tight text-neutral">
          Zde si můžete projít a případně upravit svoje odpovědi a jejich váhu.
        </p>
        <div className="grid items-start gap-4">
          {questions.map((question, index) => {
            const currentQuestion = index + 1;
            return (
              <RecapitulationCard
                key={`Recapitulation card id:${question.id}`}
                currentQuestion={currentQuestion}
                questionCount={questions.length}
                question={question}
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
    </>
  );
}
