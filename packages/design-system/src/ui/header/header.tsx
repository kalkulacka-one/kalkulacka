import { Logo } from "@repo/design-system/svg";

export function Header() {
  return (
    <header className="k1-max-w-[100vw]">
      <div className="k1-flex k1-w-full k1-items-center k1-gap-2 k1-p-4 sm:k1-p-8">
        <Logo className="k1-h-5 k1-w-[5.953rem]" />
        <div className="k1-hidden k1-text-sm k1-font-bold k1-uppercase sm:k1-block">
          Volební kalkulačka
        </div>
      </div>
    </header>
  );
}
