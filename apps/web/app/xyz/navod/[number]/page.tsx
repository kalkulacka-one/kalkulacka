"use client";
import { Button, StepProgress } from "@repo/design-system/ui";
import Link from "next/link";
import { useGuideStore } from "../../store";
import { ArrowIconRight } from "@repo/design-system/icons";

const steps = {
  answers: [
    { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "2", status: null },
    { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
  ],
  totalQuestion: 4,
  currentQuestion: 1,
};

export default function Page({ params }) {
  const guide = useGuideStore((state) => state.guide);
  const currentStep = useGuideStore((state) => state.currentStep);
  const stepTotal = useGuideStore((state) => state.stepTotal);
  const nextStep = useGuideStore((state) => state.nextStep);
  const prevStep = useGuideStore((state) => state.prevStep);

  return (
    <div className="grid h-screen w-screen grid-cols-3 place-content-center">
      <div className="flex items-center justify-end">
        {currentStep === 1 ? null : (
          <Button onClick={prevStep} fitContent kind="link">
            <span className="text-2xl">←</span>
          </Button>
        )}
      </div>
      <div className="flex flex-col">
        {/* store content */}
        {guide.map((item, index) => {
          const current = index + 1;
          if (current === currentStep) {
            return <div>{item.content}</div>;
          }
        })}
        {/* mockup content */}
        {/* <div className="flex flex-col items-center">
          <span className="font-primary text-neutral-strong text-2xl font-bold tracking-tight">
            Krajské volby
            <span className="text-neutral text-base">Jihomoravský kraj</span>
          </span>
          <p className="font-primary text-base">
            Vítejte ve Volební kalkulačce pro krajské volby 2024 pro
            Jihomoravský kraj. Čeká vás 25 otázek. Stejné otázky dostaly všechny
            kandidující strany. Zodpovězení otázek zabere zhruba 10 minut a na
            konci se dozvíte, jak se jednotlivé strany shodují s vašimi názory.
          </p>
          <p className="font-primary text-base">
            Oslovili jsme všechny strany bez výjimky. Pokud se některá neobjeví
            ve výsledcích, je to proto, že (zatím) neposlala svoje odpovědi.
          </p>
        </div> */}
        <div></div>
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase">
            Návod {currentStep} / {stepTotal}
          </span>
          <StepProgress steps={steps} />
        </div>
        <div className="flex w-auto flex-col items-center">
          <Button onClick={nextStep} fitContent kind="outline">
            Další krok
          </Button>
          {currentStep === 4 ? (
            <Button
              kind="filled"
              size="default"
              color="primary"
              iconPosition="right"
              icon={ArrowIconRight}
              hasIcon
              compactable
              wider
              fitContent
            >
              <Link href="/xyz/1">První otázka</Link>
            </Button>
          ) : (
            <Button fitContent kind="link">
              <Link href="/xyz/1">Přeskočit návod ▶▶</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-start">
        {currentStep === 4 ? null : (
          <Button onClick={nextStep} fitContent kind="link">
            <span className="text-2xl">→</span>
          </Button>
        )}
      </div>
    </div>
  );
}
