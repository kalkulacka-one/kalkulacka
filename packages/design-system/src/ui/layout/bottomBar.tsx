import { ButtonInFavour, ButtonAgainst } from "@repo/design-system/ui";
import { StepProgressFancy } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import { Question } from "@repo/schema/dist";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

type ButtonType = "inFavour" | "against" | "star";

type Props = {
  // solve unused button type eslint (no-unused-vars) problem
  starPressed?: boolean;
  onClick: (button: ButtonType) => void;
  questions?: ExtendedQuestions[];
  currentQuestion: number;
  questionTotal: number;
};

export function BottomBar({
  starPressed,
  onClick,
  questions,
  questionTotal,
  currentQuestion,
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
            starPressed={starPressed ? starPressed : false}
            onClick={() => onClick("star")}
          />
          <ButtonInFavour onClick={() => onClick("inFavour")} />
          <ButtonAgainst onClick={() => onClick("against")} />
        </div>
      </div>
    </div>
  );
}
// TODO
// 1. Buttons on mobile wihout texts WIDTH!
// 3. Bottom bar positioning
