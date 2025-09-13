import { Logo } from "@repo/design-system/client";

import { canonical } from "../../../../lib/routing/url-builders";

export function NavigationCardAttribution() {
  return (
    <a href={canonical.homepage()} target="_blank" className="group p-2 flex items-center gap-2 rounded-lg text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 min-w-max">
      <span>Přináší</span>
      <div className="group-hover:hidden">
        <Logo title="Volební kalkulačka" size="small" monochrome />
      </div>
      <div className="hidden group-hover:block">
        <Logo title="Volební kalkulačka" size="small" />
      </div>
      <span>Volební kalkulačka</span>
    </a>
  );
}
