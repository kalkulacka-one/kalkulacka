import { YesToggleButton, NoToggleButton } from "@repo/design-system/ui";
import { StepProgressFancy } from "@repo/design-system/ui";
import { StarIconButton } from "@repo/design-system/ui";
import type { ExtendedQuestions } from "../../../../../apps/web/app/abc/providers/store.types";

type Props = {
  starPressed?: boolean;
  yesPressed?: boolean | null;
  noPressed?: boolean | null;
  toggleImportant: () => void;
  yesClick: () => void;
  noClick: () => void;
  questions: ExtendedQuestions[];
  currentQuestion: number;
  questionTotal: number;
};

export function BottomBar({
  starPressed,
  yesPressed,
  noPressed,
  yesClick,
  noClick,
  questions,
  questionTotal,
  currentQuestion,
  toggleImportant,
}: Props) {
  return (
    // main wrapper
    <div className="k1-sticky k1-bottom-0 k1-h-fit k1-w-full k1-bg-white">
      {/* count status wrapper */}
      <div>
        <StepProgressFancy
          questions={questions}
          questionTotal={questionTotal}
          currentQuestion={currentQuestion}
        />
      </div>
      {/* button wrapper */}
      <div className="k1-flex k1-justify-center k1-p-4">
        <div className="k1-grid k1-w-full k1-grid-cols-[auto_1fr_1fr] k1-items-center k1-justify-center k1-gap-4 xs:k1-w-auto lg:k1-w-clamp-custom">
          <div className="min-[576px]:k1-mr-[calc(1rem*2)]">
            <StarIconButton
              starPressed={starPressed ? true : false}
              onClick={toggleImportant}
            >
              Pro mě důležité
            </StarIconButton>
          </div>
          <YesToggleButton
            onClick={yesClick}
            // null worked
            pressed={yesPressed ? true : undefined}
          />
          <NoToggleButton
            onClick={noClick}
            pressed={noPressed ? true : undefined}
          />
        </div>
      </div>
    </div>
  );
}
