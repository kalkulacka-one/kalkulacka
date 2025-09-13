import { Logo } from "@repo/design-system/client";

export type NavigationCardAttribution = {
  href: string;
};

export function NavigationCardAttribution({ href }: NavigationCardAttribution) {
  return (
    <div className="flex justify-center">
      <a href={href} target="_blank" className="group p-2 flex items-center gap-2 rounded-lg text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100">
        <span>Přináší</span>
        <div className="group-hover:hidden">
          <Logo title="Volební kalkulačka" size="small" monochrome />
        </div>
        <div className="hidden group-hover:block">
          <Logo title="Volební kalkulačka" size="small" />
        </div>
        <span>Volební kalkulačka</span>
      </a>
    </div>
  );
}
