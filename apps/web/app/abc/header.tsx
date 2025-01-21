"use client";

import { Logo } from "@repo/design-system/svg";
import { useQuestionsStore } from "./providers/storeProvider";
import { Button } from "@repo/design-system/ui";
import { CloseIcon } from "@repo/design-system/icons";
import { usePathname } from "next/navigation";

export default function Header() {
  const guide = useQuestionsStore((state) => state.guide);
  const path = usePathname();

  return (
    <header className="max-w-[100vw] bg-white">
      <div className="flex w-full items-center justify-between gap-2 p-4 sm:p-8">
        {/* logo wrapper */}
        <div className="flex gap-2">
          <Logo className="h-5 w-[5.953rem]" />
          <div className="hidden text-sm font-bold uppercase sm:block">
            Volební kalkulačka
          </div>
        </div>
        {/* title component, refactor */}
        {guide[0]?.title && guide[0]?.region ? (
          <div className="mr-auto">
            <p className="font-primary text-sm text-neutral">
              {guide[0]?.title} — {guide[0]?.region}
            </p>
          </div>
        ) : null}
        {/* refactor visiblity condition later */}
        {path != "/" && (
          <Button
            fitContent
            kind="link"
            size="auto"
            icon={CloseIcon}
            hasIcon
            iconPosition="right"
            // refactor
            onClick={() => alert("Back to home")}
          >
            Zpět na hlavní stránku
          </Button>
        )}
      </div>
    </header>
  );
}
