"use client";

import { Button, StepProgress, Blobs } from "@repo/design-system/ui";
import { useQuestionsStore } from "../../providers/storeProvider";
import Link from "next/link";
import { ArrowIconRight } from "@repo/design-system/icons";

export default function Page() {
  const guide = useQuestionsStore((state) => state.guide);
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  const prevGuide = useQuestionsStore((state) => state.prevGuide);
  const nextGuide = useQuestionsStore((state) => state.nextGuide);
  return (
    <div className="grid h-screen grid-rows-[1fr_auto]">
      {/* <Blobs /> */}
      {/* fix height !!! */}
      <main className="items-center xs:flex xs:flex-col xs:gap-2 min-[701px]:grid min-[701px]:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:grid sm:grid-cols-[1fr_clamp(32rem,_50vw,_48rem)_1fr] sm:gap-8">
        {/* grid col 1 */}
        <div className="flex items-center justify-end">
          {guideNumber === 1 ? null : (
            <Button onClick={prevGuide} fitContent kind="link">
              <span className="text-2xl">←</span>
            </Button>
          )}
        </div>
        {/* grid col 2 */}
        <div className="flex flex-col">
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
              return <div>{item.message}</div>;
            }
          })}
          <div></div>
        </div>
        {/* grid col 3 */}
        <div className="flex items-center justify-start">
          {guideNumber === 4 ? null : (
            <Button onClick={nextGuide} fitContent kind="link">
              <span className="text-2xl">→</span>
            </Button>
          )}
        </div>
      </main>
      <div className="sticky bottom-0 grid justify-center gap-4 bg-blue-200 p-4 sm:bg-transparent md:w-1/4 md:grid-cols-2 md:justify-self-center">
        {/* grid col 1 */}
        <div className="justify-self-start ">
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
              compactable
              wider
            >
              <Link href="/xyz/1">První otázka</Link>
            </Button>
          )}
        </div>
        {/* grid col 4 */}
        <div className="col-[1_/_span_2] justify-self-center ">
          {guideNumber === 4 ? (
            <div>Empty</div>
          ) : (
            <Button fitContent kind="link">
              <Link href="/xyz/1">Přeskočit návod ▶▶</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// {/* <div className="flex items-center justify-between">
// {/* add as label typography component */}
// <span className="font-primary text-xs font-bold uppercase tracking-wide text-neutral-strong">
//   Návod {guideNumber} / {guide.length}
// </span>
// {/* solve type error and answer type general assign? */}
// <StepProgress
//   currentQuestion={guideNumber}
//   totalQuestion={guide.length}
//   answers={guide}
// />
// </div>
// {guideNumber !== guide.length && (
// <Button
//   icon={ArrowIconRight}
//   iconPosition="right"
//   onClick={nextGuide}
//   color="neutral"
//   fitContent
//   kind="outline"
// >
//   Další krok
// </Button>
// )}

// {guideNumber === 4 ? (
// <Button
//   kind="filled"
//   size="default"
//   color="primary"
//   iconPosition="right"
//   icon={ArrowIconRight}
//   hasIcon
//   compactable
//   wider
//   fitContent
// >
//   <Link href="/xyz/1">První otázka</Link>
// </Button>
// ) : (
// <Button fitContent kind="link">
//   <Link href="/xyz/1">Přeskočit návod ▶▶</Link>
// </Button>
// )} */}
