"use client";
import {
  ArrowIconLeft,
  ArrowIconRight,
  PercentageIcon,
} from "@repo/design-system/icons";
import { Blobs, Button, RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../providers/storeProvider";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const handleAnswer = () => {
    alert("Clicked!");
  };
  return (
    <>
      <Blobs />
      {/* header */}
      <header className="sticky top-0 grid grid-cols-[auto_1fr_auto] items-center gap-8 bg-white p-4 sm:justify-center sm:p-8">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          size="auto"
        />
        {/* replace with typo compoment */}
        <h2 className="text-5xl  font-bold tracking-snug text-neutral-strong sm:mr-auto">
          Rekapitulace
        </h2>
        {/* twmerge button fix here */}
        <div className="hidden sm:block">
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
                onClick={handleAnswer}
              />
            );
          })}
        </div>
      </main>
      {/* bottom bar */}
      <div className="sticky bottom-0 bg-white p-4 sm:hidden">
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
      </div>
    </>
  );
}
