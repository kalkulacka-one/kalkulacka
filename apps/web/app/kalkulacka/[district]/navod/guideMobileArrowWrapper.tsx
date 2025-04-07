import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import { Button } from "@repo/design-system/ui";

type GuideMobileArrowWrapperProps = {
  guideStep: number;
  guide: any[];
  prevGuide: () => void;
  nextGuide: () => void;
};

export default function GuideMobileArrowWrapper({
  guideStep,
  prevGuide,
  nextGuide,
  guide,
}: GuideMobileArrowWrapperProps) {
  return (
    <div className="flex w-full items-start justify-between p-2 sm:hidden">
      {guideStep > 1 && (
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          className="mr-auto"
          kind="link"
          fitContent
          onClick={prevGuide}
        />
      )}
      {guideStep < guide.length && (
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          className="ml-auto"
          kind="link"
          fitContent
          onClick={nextGuide}
        />
      )}
    </div>
  );
}
