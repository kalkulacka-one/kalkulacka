import { type VariantProps, cva } from "class-variance-authority";
type Status = true | false | null | undefined;

export type StepProgressFancy = {
  questions: any[];
  currentQuestion: number;
  questionTotal: number;
} & VariantProps<typeof stepProgressVariants>;

const stepProgressVariants = cva("", {
  variants: {
    status: {
      inFavour: "bg-blue-400",
      against: "bg-red-400",
      // none: "bg-neutral-strong-active",
      isNull: "bg-gray-400",
    },
    height: {
      // fix needed: better solution than important ?
      active: "h-2 !bg-gray-800",
      inactive: "h-1",
    },
    // added empty strings for the lint check, this component awaits new merge ({status: "undefined", height:"inactive"})
    defaultVariant: {
      status: "",
      height: "",
    },
  },
});

function checkAnswer(status: number) {
  switch (status) {
    case 1:
      return "inFavour";
    case 2:
      return "against";
    case 3:
      return "isNull";
    case 0:
      return "isNull";
  }
}

export function StepProgressFancy({ questions, currentQuestion, questionTotal }: StepProgressFancy) {
  return (
    <div className="flex items-center justify-start">
      {questions.map((question: any[], index) => {
        return (
          <div
            // fix needed: better key naming ?
            key={`Step bar: ${index}`}
            style={{
              flex: `1 1 calc(100% / ${questionTotal})`,
              width: `calc(100% / ${questionTotal})`,
            }}
            className={stepProgressVariants({
              status: checkAnswer(question.answer),
              height: currentQuestion === index + 1 ? "active" : "inactive",
            })}
          />
        );
      })}
    </div>
  );
}
