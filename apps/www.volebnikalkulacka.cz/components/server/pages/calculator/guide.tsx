"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorStore } from "../../../../calculator/stores/calculatorStore";
import { useCalculatorViewModel } from "../../../../calculator/view-models/calculator.view-model";

export function GuidePage({ step }: { step: number }) {
  const params = useParams();
  const router = useRouter();
  const storeStep = useCalculatorStore((state) => state.step);
  const setStep = useCalculatorStore((state) => state.setStep);

  useEffect(() => {
    if (!storeStep) {
      setStep(step);
    }
  }, [step, setStep, storeStep]);

  const onNext = () => {
    if (storeStep) {
      router.push(`/${params.first}/${params.second}/navod/${step + 1}`);
    }
  };

  const onPrevious = () => {
    if (storeStep) {
      router.push(`/${params.first}/${params.second}/navod/${step - 1}`);
    }
  };

  const calculator = useCalculatorViewModel();
  if (!calculator && !storeStep) {
    return <div>...Loading</div>;
  }
  return <AppGuidePage calculator={calculator} step={step} onNext={onNext} onPrevious={onPrevious} />;
}
