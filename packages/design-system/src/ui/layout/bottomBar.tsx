import { ButtonInFavour, ButtonAgainst } from "@repo/design-system/ui";
import { StepProgressFancy } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import type { ExtendedQuestions } from "../../../../../apps/web/app/xyz/store";

type Props = {
  // solve unused button type eslint (no-unused-vars) problem
  starPressed?: boolean;
  toggleImportant: () => void;
  yesClick: () => void;
  noClick: () => void;
  questions: ExtendedQuestions[];
  currentQuestion: number;
  questionTotal: number;
};

export function BottomBar({
  starPressed,
  yesClick,
  noClick,
  questions,
  questionTotal,
  currentQuestion,
  toggleImportant,
}: Props) {
  return (
    // main wrapper
    <div className="k1-sticky k1-bottom-0 k1-bg-white">
      {/* count status wrapper */}
      <div>
        <StepProgressFancy
          questions={questions}
          questionTotal={questionTotal}
          currentQuestion={currentQuestion}
        />
      </div>
      {/* button wrapper */}
      <div className="k1-flex k1-justify-center">
        <div className="k1-grid k1-w-auto k1-grid-cols-[auto_1fr_1fr] k1-items-center k1-justify-center k1-gap-4">
          <StarIconButton
            starPressed={starPressed ? true : false}
            onClick={toggleImportant}
          >
            Pro mě důležité
          </StarIconButton>
          <ButtonInFavour onClick={yesClick} />
          <ButtonAgainst onClick={noClick} />
        </div>
      </div>
    </div>
  );
}
// TODO
// 1. Buttons on mobile wihout texts WIDTH!
// 3. Bottom bar positioning
