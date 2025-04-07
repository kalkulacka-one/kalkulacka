import { Logo } from "@repo/design-system/svg";

export default function LogoWrapper() {
  return (
    <div className="flex items-center">
      <Logo className="h-5 w-[5.953rem]" />
      <div className="ml-[.563rem] hidden text-sm font-bold uppercase sm:block">
        Volební kalkulačka
      </div>
    </div>
  );
}
