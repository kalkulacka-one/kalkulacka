"use client";

import { RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../providers/storeProvider";
import RecapHeader from "./recapHeader";
import RecapBottomBar from "./recapBottomBar";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  return (
    // page wrapper
    <div className="flex min-h-screen flex-col">
      {/* rekapitulace header */}
      <RecapHeader lastQuestion={questions.length} />
      {/* main content */}
      <main className="grid grid-cols-1 justify-center gap-4 p-4 min-[701px]:grid-cols-[clamp(32rem,50vw,48rem)]">
        {/* grid col 1 */}
        {/* replace with typo compoment */}
        <p className="text-sm leading-tight text-neutral">
          Zde si můžete projít a případně upravit svoje odpovědi a jejich váhu.
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
      <RecapBottomBar />
    </div>
  );
}
