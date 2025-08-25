"use client";

import { Button, ToggleButton } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useElectionStore } from "../../../stores/electionStore";
import UrlUpdater from "../urlUpdater";

export default function OtazkaPage({ questionStep }: { questionStep: number }) {
  const params = useParams();
  const router = useRouter();
  const calculator = useElectionStore((state) => state.calculator);
  const storeQuestionStep = useElectionStore((state) => state.questionStep);
  const setStoreQuestionStep = useElectionStore((state) => state.setQuestionStep);
  const handleAnswer = useElectionStore((state) => state.handleAnswer);
  const answers = useElectionStore((state) => state.answers);
  const handleQuestionStep = useElectionStore((state) => state.handleQuestionStep);

  useEffect(() => {
    setStoreQuestionStep(questionStep);
  }, [questionStep, setStoreQuestionStep]);

  if (!calculator) {
    return <div>Loading...</div>;
  }

  const currentQuestionId = calculator.questions[storeQuestionStep - 1].id;
  const storeMaxQuestionStep = calculator.questions.length;

  return (
    <>
      <UrlUpdater />
      <div>
        <div>
          {calculator.questions.map((question: any, index: number) => {
            if (storeQuestionStep - 1 === index)
              return (
                <Card key={question.id} color="white">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <span>
                        {storeQuestionStep}/{calculator.questions.length}
                      </span>
                      <span>{question.title}</span>
                      <span>{question.tags}</span>
                    </div>
                    <div className="text-2xl">{question.statement}</div>
                    <div className="text-2xl">{question.detail}</div>
                  </div>
                </Card>
              );
          })}
        </div>
        <div className="flex gap-4">
          <ToggleButton variant="answer" color="neutral" checked={answers?.[storeQuestionStep - 1]?.isImportant} onChange={() => handleAnswer(currentQuestionId, "important", "otazka")}>
            Pro mě důležité
          </ToggleButton>
          <ToggleButton
            variant="answer"
            checked={answers?.[storeQuestionStep - 1]?.answer === true}
            color="primary"
            onChange={() => {
              if (storeQuestionStep === calculator.questions.length && answers?.[storeQuestionStep - 1]?.answer === null) {
                router.push(`/kalkulacka/${params.group}/${params.calculator}/rekapitulace`);
              }
              handleAnswer(currentQuestionId, "yes", "otazka");
            }}
          >
            Jsem pro
          </ToggleButton>
          <ToggleButton
            variant="answer"
            checked={answers?.[storeQuestionStep - 1]?.answer === false}
            color="secondary"
            onChange={() => {
              if (storeQuestionStep === calculator.questions.length && answers?.[storeQuestionStep - 1]?.answer === null) {
                router.push(`/kalkulacka/${params.group}/${params.calculator}/rekapitulace`);
              }
              handleAnswer(currentQuestionId, "no", "otazka");
            }}
          >
            Jsem proti
          </ToggleButton>
        </div>
        <div className="flex gap-4">
          <Button variant="link" color="neutral" onClick={() => handleQuestionStep("previous")}>
            Předchozí
          </Button>
          <Button variant="link" color="neutral" onClick={() => handleQuestionStep("next")}>
            Přeskočit
          </Button>
        </div>
        <div className="flex gap-4">
          {storeQuestionStep === storeMaxQuestionStep ? (
            <Link href={`/kalkulacka/${params.group}/${params.calculator}/rekapitulace`}>
              <Button color="neutral" variant="link">
                Rekapitulace
              </Button>
            </Link>
          ) : (
            <Link href={`/kalkulacka/${params.group}/${params.calculator}/navod/1`}>
              <Button color="neutral" variant="link">
                Návod
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
