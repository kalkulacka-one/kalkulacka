import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import { CardTwo, CardThree, CardFour } from "./guideHtml";
import { Button } from "@repo/design-system/ui";

type GuideWrapperProps = {
  guide: any[];
  guideStep: number;
  prevGuide: () => void;
  nextGuide: () => void;
  intro: string;
  electionType: string;
  electionRegion: any;
};

const guideCardSwitcher = (number: number) => {
  switch (number) {
    case 1: {
      return null;
    }
    case 2: {
      return <CardTwo />;
    }
    case 3: {
      return <CardThree />;
    }
    case 4: {
      return <CardFour />;
    }
  }
};

export default function GuideWrapper({
  guide,
  guideStep,
  prevGuide,
  nextGuide,
  intro,
  electionRegion,
  electionType,
}: GuideWrapperProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      {/* fix height !!! */}
      <div className="flex-1 place-content-center items-center xs:flex xs:flex-col xs:gap-2 min-[701px]:grid min-[701px]:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:grid sm:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:gap-8">
        {/* grid col 1 */}
        {/* empty div for 700 - 767 screen width */}
        <div className="block sm:hidden"></div>
        <div className="hidden items-center justify-end sm:flex">
          {guideStep === 1 ? null : (
            <Button
              hasIcon
              icon={ArrowIconLeft}
              iconPosition="left"
              kind="link"
              fitContent
              onClick={prevGuide}
            />
          )}
        </div>
        {/* grid col 2 */}
        <div className="flex flex-col gap-4 p-4">
          {/* store content */}
          {/* add as title-m typography component, make content dynamic */}
          {guide.map((item, index) => {
            if (index + 1 === guideStep) {
              return (
                <div
                  className="flex flex-col gap-4"
                  key={`Guide wrapper number ${index + 1}`}
                >
                  {guideStep === 1 && (
                    <div className="flex flex-col text-3xl font-bold text-neutral-strong xs:flex-row xs:items-end xs:gap-2">
                      <span>{electionType}</span>
                      <span
                        style={{ fontSize: "smaller" }}
                        className="text-neutral "
                      >
                        {electionRegion}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 text-base font-normal text-neutral">
                    {guideStep === 1 && intro}
                    {item.contentBefore}
                    {guideCardSwitcher(index + 1)}
                    {item.contentAfter}
                  </div>
                </div>
              );
            }
          })}
        </div>
        {/* grid col 3 */}
        {/* empty div for 700 - 767 screen width */}
        <div className="block sm:hidden"></div>
        <div className="hidden items-center justify-start sm:flex">
          {guideStep === 4 ? null : (
            <Button
              hasIcon
              icon={ArrowIconRight}
              iconPosition="right"
              kind="link"
              fitContent
              onClick={nextGuide}
            />
          )}
        </div>
      </div>
    </div>
  );
}
