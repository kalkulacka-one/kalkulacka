import { Logo } from "@repo/design-system/svg";

export function Header() {
  return (
    <header className="k1-max-w-[100vw]">
      <div className="k1-w-full k1-flex k1-items-center k1-gap-2 k1-p-4 sm:k1-p-8">
        <Logo className="k1-h-5 k1-w-[5.953rem]" />
        <div className="k1-hidden sm:k1-block k1-uppercase k1-font-bold k1-text-sm">
          Volební kalkulačka
        </div>
      </div>
    </header>
  );
}
