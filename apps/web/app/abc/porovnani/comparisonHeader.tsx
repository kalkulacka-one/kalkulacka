/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { ArrowIconLeft } from "@repo/design-system/icons";
import { Button, FilterToggleButton } from "@repo/design-system/ui";
import Link from "next/link";
import { useState } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import organizations from "./data/organizations.json";
import ComparisonFilter from "./comparisonFilter";

export default function ComparisonHeader() {
  const [filterToggled, setFilterToggled] = useState(false);
  const questions = useQuestionsStore((state) => state.questions);
  const tags = questions.map((question) => question.tags).flat();
  const uniqueTags = tags.filter((item, index) => tags.indexOf(item) === index);

  function handleToggle() {
    setFilterToggled((prevState) => !prevState);
  }
  return (
    <>
      <header className="sticky left-0 top-0 z-20 grid max-w-[100vw] grid-cols-[auto_1fr_auto] items-center gap-4 bg-white p-2 backdrop-blur-[6px] xs:p-4 sm:gap-8 sm:p-8">
        {/* fix link wrap, should be link in style of a button! */}
        {/*Link to the last question "current quesiton" */}
        <div className="flex items-center  justify-self-start">
          <Link className="flex items-center" href={`/abc/vysledky`}>
            <Button
              hasIcon
              icon={ArrowIconLeft}
              iconPosition="left"
              kind="link"
              fitContent
              size="auto"
              // important is temp fix due to probable twMerge strane behavior
              className="!k1-justify-center k1-p-2"
            />
          </Link>
        </div>

        <div className="absolute justify-self-center sm:relative sm:mr-auto">
          {/* replace with typo compoment */}
          <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
            Porovnání
          </h2>
        </div>

        <div className="justify-self-end">
          <FilterToggleButton onClick={handleToggle} />
        </div>
      </header>
      {filterToggled && (
        <ComparisonFilter tags={uniqueTags} organizations={organizations} />
      )}
    </>
  );
}
