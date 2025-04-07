import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

type QuestionsMobileArrowWrapperProps = {
  currentQuestion: number;
  questions: any[];
  prevQuestion: () => void;
  skipQuestion: () => void;
};

export default function QuestionsMobileArrowWrapper({
  currentQuestion,
  prevQuestion,
  skipQuestion,
  questions,
}: QuestionsMobileArrowWrapperProps) {
  const params = useParams();
  const district = params.district;
  return (
    <div className="absolute top-0 flex w-dvw items-start justify-between p-2 xs:p-4 sm:hidden">
      {currentQuestion === 1 ? (
        <Link href={`/kalkulacka/${district}/navod`}>
          <Button
            hasIcon
            icon={ArrowIconLeft}
            iconPosition="left"
            kind="link"
            fitContent
            size="auto"
          >
            {currentQuestion === 1 ? "Návod" : "Předchozí"}
          </Button>
        </Link>
      ) : (
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          size="auto"
          onClick={prevQuestion}
        >
          {currentQuestion === 1 ? "Návod" : "Předchozí"}
        </Button>
      )}

      {currentQuestion >= questions.length ? (
        <Link href={`/kalkulacka/${district}/rekapitulace`}>
          <Button
            hasIcon
            icon={ArrowIconRight}
            iconPosition="right"
            kind="link"
            size="auto"
            fitContent
          >
            {currentQuestion >= questions.length ? "Rekapitulace" : "Přeskočit"}
          </Button>
        </Link>
      ) : (
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          kind="link"
          size="auto"
          fitContent
          onClick={skipQuestion}
        >
          {currentQuestion >= questions.length ? "Rekapitulace" : "Přeskočit"}
        </Button>
      )}
    </div>
  );
}
