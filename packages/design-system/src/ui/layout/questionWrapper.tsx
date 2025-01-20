import { Button } from "@repo/design-system/ui";
import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import { QuestionCard } from "@repo/design-system/ui";
import type { Question } from "@repo/schema/dist/question.schema";
import Link from "next/link";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null | undefined;
};

export interface Props {
  question: ExtendedQuestions;
  currentQuestion: number;
  questionCount: number;
  skipQuestion: () => void;
  prevQuestion: () => void;
}

export function QuestionWrapper({
  currentQuestion,
  questionCount,
  question,
  skipQuestion,
  prevQuestion,
}: Props) {
  // const { id, title, statement, detail, tags } = question;
  return (
    <>
      {/* content */}
      {/* mobile arrow bar */}
      {/* button link wrapping solve! */}
      <div className="k1-absolute k1-top-0 k1-w-dvw k1-flex k1-justify-between sm:k1-hidden">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          onClick={prevQuestion}
        >
          {currentQuestion === 1 ? (
            <Link href="/abc/navod/1">Návod</Link>
          ) : (
            "Předchozí"
          )}
        </Button>
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          kind="link"
          fitContent
          onClick={skipQuestion}
        >
          {currentQuestion >= questionCount ? (
            <Link href="/abc/rekapitulace">Rekapitulace</Link>
          ) : (
            "Přeskočit"
          )}
        </Button>
      </div>

      <div className="xs:k1-flex xs:k1-flex-col xs:k1-gap-2 min-[701px]:k1-grid min-[701px]:k1-grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:k1-grid sm:k1-grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:k1-gap-8">
        {/* desktop grid content */}
        {/* Place button end with flex ok? */}
        <div className="k1-items-center k1-justify-end xs:k1-hidden min-[701px]:k1-flex">
          {/* button wrapper */}
          <div className="k1-hidden min-[701px]:k1-hidden sm:k1-block">
            <Button
              hasIcon
              fitContent
              icon={ArrowIconLeft}
              kind="link"
              onClick={prevQuestion}
              // fix k1 prefix issue!!!
            >
              {currentQuestion === 1 ? (
                <Link href="/abc/navod/1">
                  <span className="k1-hidden lg:k1-inline">Návod</span>
                </Link>
              ) : (
                <span className="k1-hidden md:k1-block">
                  Předchozí{" "}
                  <span className="k1-hidden lg:k1-inline">otázka</span>
                </span>
              )}
            </Button>
          </div>
        </div>
        <div>
          <QuestionCard
            currentQuestion={currentQuestion}
            questionCount={questionCount}
            question={question}
          />
        </div>
        <div className="k1-hidden k1-content-center xs:k1-block">
          {/* button wrapper */}
          <div className="k1-hidden min-[701px]:k1-hidden sm:k1-block">
            <Button
              hasIcon
              fitContent
              icon={ArrowIconRight}
              iconPosition="right"
              kind="link"
              onClick={skipQuestion}
            >
              {currentQuestion >= questionCount ? (
                <Link href="/abc/rekapitulace">
                  <span className="k1-hidden lg:k1-inline">Rekapitulace</span>
                </Link>
              ) : (
                <span className="k1-hidden md:k1-block">
                  Přeskočit{" "}
                  <span className="k1-hidden lg:k1-inline">otázku</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
