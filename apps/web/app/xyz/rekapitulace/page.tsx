"use client";
import { ArrowIconRight } from "@repo/design-system/icons";
import { Button, RecapitulationCard } from "@repo/design-system/ui";
import { useQuestionsStore } from "../store";
import { useEffect } from "react";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const toggleYes = useQuestionsStore((state) => state.toggleYes);
  const toggleNo = useQuestionsStore((state) => state.toggleNo);
  // const answerYes = useQuestionsStore((state) => state.answerYes);
  // const answerNo = useQuestionsStore((state) => state.answerNo);

  useEffect(() => {
    console.log("Rerender");
  }, [questions]);

  function handleAnswer(event, buttonType) {
    // console.log(event.currentTarget.dataset.buttoncardid);
    const id = event.currentTarget.dataset.buttoncardid;

    if (buttonType === "Yes") {
      toggleYes(id);
    } else if (buttonType === "No") {
      toggleNo(id);
    }
    // if (buttonType === "Ano") {
    //   // alert("Ano");
    //   console.log(questions[0].answerType);
    // } else if (buttonType === "Ne") {
    //   // alert("Ne");
    //   console.log(questions[0].answerType);
    // }
  }

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
          iconPosition="right"
          hasIcon
          compactable
          wider
          fitContent
        >
          Zobrazit výsledky
        </Button>
      </div>
      {/* fix grid here, redudant cols */}
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-1"></div>
        <div className="col-span-3 col-start-2">
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
                onClick={handleAnswer}
              />
            );
          })}
        </div>
        <div className="col-span-1 col-start-5"></div>
      </div>
    </div>
  );
}
