import { ArrowIconRight, ForwardIcon } from "@repo/design-system/icons";
import { Button, StepProgress } from "@repo/design-system/ui";
import Link from "next/link";
import { useParams } from "next/navigation";

// more specific generic needed ?
type GuideBottomBarProps = {
  guideNumber: number | null;
  nextGuide: () => void;
  steps?: any[];
};

export default function GuideBottomBar({
  guideNumber,
  nextGuide,
  steps,
}: GuideBottomBarProps) {
  const params = useParams();
  const district = params.district;
  return (
    <div className="sticky bottom-0 grid w-full grid-cols-2 justify-center gap-4 bg-white p-4 min-[701px]:grid min-[701px]:[grid-template-columns:repeat(2,8rem)] sm:bg-transparent md:w-1/4 md:justify-self-center">
      {/* grid col 1 */}
      <div className="justify-self-start">
        <span className="font-primary text-xs font-bold uppercase tracking-wide text-neutral-strong">
          Návod {guideNumber} / 4
        </span>
      </div>
      {/* grid col 2 */}
      <div className="content-center justify-self-end">
        <StepProgress currentStep={guideNumber} stepTotal={4} steps={steps} />
      </div>
      {/* grid col 3 */}
      <div className="col-[1_/_span_2]">
        {guideNumber !== 4 ? (
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
          <Link href={`/kalkulacka/${district}/otazka`}>
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
      <div
        className={`col-[1_/_span_2] justify-self-center ${guideNumber === 4 ? "invisible" : ""}`}
      >
        {/* fix link wrap, should be link in style of a button! */}
        <Link href={`/kalkulacka/${district}/otazka`}>
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
