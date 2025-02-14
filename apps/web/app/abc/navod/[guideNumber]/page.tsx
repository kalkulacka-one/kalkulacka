"use client";

import { Button } from "@repo/design-system/ui";
import { useQuestionsStore } from "../../providers/storeProvider";
import { CardTwo, CardThree, CardFour } from "../guideHtml";
import GuideBottomBar from "./guideBottomBar";
import { ArrowIconLeft, ArrowIconRight } from "@repo/design-system/icons";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const params = useParams();
  const guide = useQuestionsStore((state) => state.guide);
  // default value makes sense here, glitch in UI
  const guideNumberParam = Number(params.guideNumber);
  const currentGuide = useQuestionsStore((state) => state.currentGuide);
  const setCurrentGuide = useQuestionsStore((state) => state.setCurrentGuide);
  const prevGuide = useQuestionsStore((state) => state.prevGuide);
  const nextGuide = useQuestionsStore((state) => state.nextGuide);
  const goToGuideFromUrl = (number: number, currentGuide: number) => {
    if (number >= 1 && number <= guide.length && currentGuide >= 0) {
      setCurrentGuide(number);
    } else {
      setCurrentGuide(1);
    }
  };

  useEffect(() => {
    goToGuideFromUrl(guideNumberParam, currentGuide);
  }, []);

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

  return (
    <div className="relative flex flex-1 flex-col">
      {/* mobile arrow bar */}
      <div className="absolute top-0 flex w-full justify-between p-2 sm:hidden">
        {currentGuide > 1 && (
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
        {currentGuide < guide.length && (
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
      <main className="flex flex-1 flex-col items-center justify-center">
        {/* fix height !!! */}
        <div className="flex-1 place-content-center items-center xs:flex xs:flex-col xs:gap-2 min-[701px]:grid min-[701px]:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:grid sm:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:gap-8">
          {/* grid col 1 */}
          {/* empty div for 700 - 767 screen width */}
          <div className="block sm:hidden"></div>
          <div className="hidden items-center justify-end sm:flex">
            {currentGuide === 1 ? null : (
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
              if (index + 1 === currentGuide) {
                return (
                  <div
                    className="flex flex-col gap-4"
                    key={`Guide wrapper number ${index + 1}`}
                  >
                    <div className="flex flex-col text-3xl font-bold text-neutral-strong xs:flex-row xs:items-end xs:gap-2">
                      <span>{item.title}</span>
                      <span
                        style={{ fontSize: "smaller" }}
                        className="text-neutral "
                      >
                        {item.region}
                      </span>
                    </div>
                    <div className="flex flex-col gap-4 text-base font-normal text-neutral">
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
            {currentGuide === 4 ? null : (
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
        {/* guide bottom bar */}
        <GuideBottomBar
          guide={guide}
          guideNumber={currentGuide}
          nextGuide={nextGuide}
        />
      </main>
    </div>
  );
}
