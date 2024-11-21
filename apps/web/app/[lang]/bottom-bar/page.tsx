"use client";

import { ButtonAgainst, ButtonInFavour } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/starIconButton";
import { StepProgressFancy } from "@repo/design-system/ui";

const steps = {
  answers: [
    { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "2", status: null },
    { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "5", status: true },
    { answerId: "6", status: true }, //
    { answerId: "7", status: false },
    { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
    { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "2", status: null },
    { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "5", status: true },
    { answerId: "6", status: true }, //
    { answerId: "7", status: false },
    { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
  ],
  totalQuestion: 4,
  currentQuestion: 8,
};

const answerCount = steps.answers.length;

export default function Page() {
  return (
    // main wrapper
    <div className="sticky bottom-0 bg-slate-300">
      {/* count status wrapper */}
      <div className="w-full">
        <StepProgressFancy steps={steps} answerCount={answerCount} />
      </div>
      {/* button wrapper */}
      <div className="flex justify-center p-4">
        <div className="grid grid-cols-[auto_1fr_1fr] items-center justify-center gap-4 w-auto">
          <StarIconButton />
          <ButtonInFavour />
          <ButtonAgainst />
        </div>
      </div>
    </div>
  );
}
