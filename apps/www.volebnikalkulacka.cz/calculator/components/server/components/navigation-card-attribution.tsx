import { Logo } from "@repo/design-system/client";

import { canonical } from "../../../../lib/routing/url-builders";

export function NavigationCardAttribution() {
  return (
    <div className="flex justify-center">
      <a href={canonical.homepage()} target="_blank" className="group p-2 flex items-center gap-2 rounded-lg text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100">
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
