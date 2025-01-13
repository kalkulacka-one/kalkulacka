"use client";

import { Button, StepProgress, Blobs } from "@repo/design-system/ui";
import { useQuestionsStore } from "../../providers/storeProvider";
import { CardTwo, CardThree, CardFour } from "../guideHtml";
import Link from "next/link";
import {
  ArrowIconLeft,
  ArrowIconRight,
  ForwardIcon,
} from "@repo/design-system/icons";

export default function Page() {
  const guide = useQuestionsStore((state) => state.guide);
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  const prevGuide = useQuestionsStore((state) => state.prevGuide);
  const nextGuide = useQuestionsStore((state) => state.nextGuide);

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
    <>
      <Blobs />
      {/* mobile arrow bar */}
      <div className="absolute top-0 flex w-dvw justify-between p-2 sm:hidden">
        <Button
          hasIcon
          icon={ArrowIconLeft}
          iconPosition="left"
          kind="link"
          fitContent
          onClick={prevGuide}
        />
        <Button
          hasIcon
          icon={ArrowIconRight}
          iconPosition="right"
          kind="link"
          fitContent
          onClick={nextGuide}
        />
      </div>
      <div className="grid h-screen grid-rows-[1fr_auto]">
        {/* fix height !!! */}
        <main className="place-content-center items-center xs:flex xs:flex-col xs:gap-2 min-[701px]:grid min-[701px]:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:grid sm:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:gap-8">
          {/* grid col 1 */}
          {/* empty div for 700 - 767 screen width */}
          <div className="block sm:hidden"></div>
          <div className="hidden items-center justify-end sm:flex">
            {guideNumber === 1 ? null : (
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
            <span className="text-3xl font-bold text-neutral-strong">
              Krajské volby 2024{" "}
              <span style={{ fontSize: "smaller" }} className="text-neutral">
                Jihomoravský kraj
              </span>
            </span>
            {guide.map((item, index) => {
              const current = index + 1;
              if (current === guideNumber) {
                return (
                  <>
                    <div className="flex flex-col gap-4 text-base font-normal text-neutral">
                      {item.contentBefore}
                      {guideCardSwitcher(current)}
                      {item.contentAfter}
                    </div>
                  </>
                );
              }
            })}
          </div>
          {/* grid col 3 */}
          {/* empty div for 700 - 767 screen width */}
          <div className="block sm:hidden"></div>
          <div className="hidden items-center justify-start sm:flex">
            {guideNumber === 4 ? null : (
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
        </main>
        {/* bottom bar wrapper */}
        <div className="sticky bottom-0 grid grid-cols-2 justify-center gap-4 bg-white p-4 min-[701px]:grid min-[701px]:[grid-template-columns:repeat(2,8rem)] sm:bg-transparent md:w-1/4 md:justify-self-center">
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
              <Button
                kind="filled"
                size="default"
                color="primary"
                iconPosition="right"
                icon={ArrowIconRight}
                hasIcon
              >
                <Link href="/xyz/1">První otázka</Link>
              </Button>
            )}
          </div>
          {/* grid col 4 */}
          {/* invisible on div instead of button due to cva conflicts, fix in tw merge ? */}
          <div
            className={`col-[1_/_span_2] justify-self-center ${guideNumber === 4 ? "invisible" : null}`}
          >
            {/* fix link wrap, should be link in style of a button! */}
            <Link href="/abc/1">
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
      </div>
    </>
  );
}
