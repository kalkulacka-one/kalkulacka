import { ButtonInFavour, ButtonAgainst } from "@repo/design-system/ui";
import { StepProgressFancy } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";

export function BottomBar() {
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
      { answerId: "9", status: true }, // positive step (e.g. answerInFavour)
      { answerId: "10", status: null },
      { answerId: "11", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
      { answerId: "12", status: false }, // negative step (e.g. answerAgainst)
      { answerId: "13", status: true },
      { answerId: "14", status: true }, //
      { answerId: "15", status: false },
      { answerId: "16", status: undefined }, // step with no sratus (e.g. not visited yet)
      { answerId: "17", status: undefined }, // step with no sratus (e.g. not visited yet)
      { answerId: "18", status: true }, // positive step (e.g. answerInFavour)
      { answerId: "19", status: null },
      { answerId: "20", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
      { answerId: "21", status: false }, // negative step (e.g. answerAgainst)
      { answerId: "22", status: true },
      { answerId: "23", status: true }, //
      { answerId: "24", status: false },
      { answerId: "25", status: undefined }, // step with no sratus (e.g. not visited yet)
    ],
    totalQuestion: 4,
    currentQuestion: 8,
  };

  return (
    // main wrapper
    <div className="k1-sticky k1-bottom-0 k1-bg-white">
      {/* count status wrapper */}
      <div>
        <StepProgressFancy steps={steps} />
      </div>
      {/* button wrapper */}
      <div className="k1-flex k1-justify-center">
        <div className="k1-grid k1-w-auto k1-grid-cols-[auto_1fr_1fr] k1-items-center k1-justify-center k1-gap-4">
          <StarIconButton />
          <ButtonInFavour />
          <ButtonAgainst />
        </div>
      </div>
    </div>
  );
}
// TODO
// 1. Buttons on mobile wihout texts WIDTH!
// 2. Statuses proper styling (bg) check with live
// 3. Bottom bar positioning
