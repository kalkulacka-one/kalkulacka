import { cva, VariantProps } from "class-variance-authority";
import { Question } from "@repo/schema/dist";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

type Status = true | false | null | undefined;

type Props = {
  questions: ExtendedQuestions[];
  currentQuestion: number;
  questionTotal: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("", {
  variants: {
    status: {
      inFavour: "k1-bg-primary-strong",
      against: "k1-bg-secondary-strong",
      // none: "k1-bg-neutral-strong-active",
      isNull: "k1-bg-neutral-disabled",
    },
    height: {
      // fix needed: better solution than important ?
      active: "k1-h-2 !k1-bg-neutral-strong-active",
      inactive: "k1-h-1",
    },
    // added empty strings for the lint check, this component awaits new merge ({status: "undefined", height:"inactive"})
    defaultVariant: {
      status: "",
      height: "",
    },
  },
});

function checkStatus(status: Status) {
  switch (status) {
    case true:
      return "inFavour";
    case false:
      return "against";
    case null:
      return "isNull";
  }
}

const StepProgressFancy = ({
  questions,
  currentQuestion,
  questionTotal,
}: Props): JSX.Element => {
  return (
    <div className="k1-flex k1-h-6 k1-items-center k1-justify-start">
      {questions.map((answer, index) => {
        return (
          <div
            // fix needed: better key naming ?
            key={`Step bar: ${index}`}
            style={{
              flex: `1 1 calc(100% / ${questionTotal})`,
              width: `calc(100% / ${questionTotal})`,
            }}
            className={stepProgressVariants({
              status: checkStatus(answer.answerType),
              height: currentQuestion === index + 1 ? "active" : "inactive",
            })}
          ></div>
        );
      })}
    </div>
  );
};

export { StepProgressFancy };
