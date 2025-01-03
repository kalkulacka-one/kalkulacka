"use client";
import { Button, StepProgress } from "@repo/design-system/ui";
import Link from "next/link";
import { useGuideStore } from "../../store";
import { ArrowIconRight } from "@repo/design-system/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({ params }) {
  const router = useRouter();
  const guide = useGuideStore((state) => state.guide);
  const currentStep = useGuideStore((state) => state.currentStep);
  const stepTotal = useGuideStore((state) => state.stepTotal);
  const nextStep = useGuideStore((state) => state.nextStep);
  const prevStep = useGuideStore((state) => state.prevStep);

  useEffect(() => {
    // Always do navigations after the first render
    // shallow error?
    router.push(`/xyz/navod/${currentStep}`, undefined, { shallow: true });
  }, [currentStep]);

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
        <div></div>
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase">
            Návod {currentStep} / {stepTotal}
          </span>
          <StepProgress
            currentQuestion={currentStep}
            totalQuestion={stepTotal}
            // solve type error
            answers={guide}
          />
        </div>
        <div className="flex w-auto flex-col items-center">
          {currentStep !== stepTotal && (
            <Button onClick={nextStep} fitContent kind="outline">
              Další krok
            </Button>
          )}

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
