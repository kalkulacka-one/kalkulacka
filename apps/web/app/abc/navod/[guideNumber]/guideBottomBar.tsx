import { ArrowIconRight, ForwardIcon } from "@repo/design-system/icons";
import { Button, StepProgress } from "@repo/design-system/ui";
import Link from "next/link";

type Guide = {
  title?: string;
  region?: string;
  contentBefore?: string;
  contentAfter?: string;
}[];

type Props = {
  guideNumber: number | null;
  guide: Guide;
  nextGuide: () => void;
};

export default function GuideBottomBar({
  guideNumber,
  guide,
  nextGuide,
}: Props) {
  return (
    <div className="bg-white sticky w-full bottom-0 grid grid-cols-2 justify-center gap-4 p-4 min-[701px]:grid sm:bg-transparent md:w-1/4 md:justify-self-center min-[701px]:[grid-template-columns:repeat(2,8rem)]">
      {/* grid col 1 */}
      <div className="justify-self-start">
        <span className="font-primary text-xs font-bold uppercase tracking-wide text-neutral-strong">
          Návod {guideNumber} / {guide.length}
        </span>
      </div>
      {/* grid col 2 */}
      <div className="content-center justify-self-end">
        {/* fix type error */}
        <StepProgress
          currentQuestion={guideNumber}
          totalQuestion={guide.length}
          answers={guide}
        />
      </div>
      {/* grid col 3 */}
      <div className="col-[1_/_span_2]">
        {guideNumber !== guide.length ? (
          <Button
            icon={ArrowIconRight}
            iconPosition="right"
            onClick={nextGuide}
            color="neutral"
            kind="outline"
          >
            Další krok
          </Button>
        ) : (
          <Link href="/abc/otazka/1">
            <Button
              kind="filled"
              size="default"
              color="primary"
              iconPosition="right"
              icon={ArrowIconRight}
              hasIcon
            >
              První otázka
            </Button>
          </Link>
        )}
      </div>
      {/* grid col 4 */}
      {/* invisible on div instead of button due to cva conflicts, fix in tw merge ? */}
      <div
        className={`col-[1_/_span_2] justify-self-center ${guideNumber === 4 ? "invisible" : null}`}
      >
        {/* fix link wrap, should be link in style of a button! */}
        <Link href="/abc/otazka/1">
          <Button
            fitContent
            kind="link"
            size="auto"
            icon={ForwardIcon}
            hasIcon
            iconPosition="right"
          >
            Přeskočit návod
          </Button>
        </Link>
      </div>
    </div>
  );
}
