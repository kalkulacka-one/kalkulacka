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
    <header className="sticky bottom-0 left-0 max-w-[100vw] bg-white">
      <div className="flex w-full items-center gap-2 p-2 xs:p-4 min-[576px]:gap-4 sm:p-8">
        {/* logo wrapper */}
        <div className="flex gap-2">
          <Logo className="h-5 w-[5.953rem]" />
          <div className="hidden text-sm font-bold uppercase sm:block">
            Volební kalkulačka
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between">
          {/* title component, refactor */}
          {/* centered title fix on mobile!!! */}
          {guide[0]?.title && guide[0]?.region ? (
            <div>
              <p
                className="font-primary 
           text-sm text-neutral max-[575px]:text-xs"
              >
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
              <span className="hidden sm:inline">Zpět na hlavní stránku</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// TODO:
// 1. Check incode comments and fix/refactor
