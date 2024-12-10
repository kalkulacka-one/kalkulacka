import { cva, VariantProps } from "class-variance-authority";

type Status = true | false | null | undefined;

type Props = {
  steps: {
    currentQuestion: number;
    totalQuestion: number;
    answers: { answerId: string; status: Status }[];
  };
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
      active: "k1-h-2 k1-bg-neutral-strong-active",
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

const StepProgressFancy = ({ steps }: Props): JSX.Element => {
  const answersData = steps.answers;
  const { currentQuestion } = steps;

  return (
    <div className="k1-flex k1-h-6 k1-items-center k1-justify-start">
      {answersData.map((answer, index) => {
        return (
          <div
            style={{
              flex: `1 1 calc(100% / ${steps.answers.length})`,
              width: `calc(100% / ${steps.answers.length})`,
            }}
            className={stepProgressVariants({
              status: checkStatus(answer.status),
              height: currentQuestion === index + 1 ? "active" : "inactive",
            })}
          ></div>
        );
      })}
    </div>
  );
};

export { StepProgressFancy };
