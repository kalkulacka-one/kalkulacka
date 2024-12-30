"use client";
import { ArrowIconRight } from "@repo/design-system/icons";
import { Button, RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../store";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);

  return (
    <div className="flex flex-col">
      {/* sticky subheader */}
      <div className="flex h-fit items-center justify-between gap-4 bg-red-400">
        <Button fitContent kind="link">
          <span className="text-2xl">←</span>
        </Button>
        <span className="mr-auto text-2xl font-bold">Rekapitulace</span>
        <Button
          kind="filled"
          size="default"
          color="primary"
          icon={ArrowIconRight}
          iconPosition="left"
          hasIcon
          compactable
          wider
          fitContent
        >
          Zobrazit výsledky
        </Button>
      </div>
      {/* rekapitulace cards */}
      {/* fix grid here, redudant cols */}
      <div className="grid">
        <div>
          <span>
            Zde si můžete projít a případně upravit svoje odpovědi a jejich
            váhu.
          </span>
          {questions.map((question, index) => {
            const currentQuestion = index + 1;
            return (
              <RecapitulationCard
                key={`Recapitulation card id:${question.id}`}
                currentQuestion={currentQuestion}
                questionCount={questions.length}
                question={question}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
