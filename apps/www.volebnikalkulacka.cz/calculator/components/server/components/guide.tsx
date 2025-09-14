import { Card } from "@repo/design-system/server";
import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Guide = {
  calculator: CalculatorViewModel;
};

export function Guide({ calculator }: Guide) {
  return (
    <div className="grid gap-4">
      <Card shadow="hard" className="border border-slate-300">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ✅
          </span>
          <div>
            <p className="font-semibold text-slate-700">Shoda</p>
            <p className="text-sm text-slate-500">Při shodě s Vaší odpovědí strana nebo politik dostane bod</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-300">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ❌
          </span>
          <div>
            <p className="font-semibold text-slate-700">Neshoda</p>
            <p className="text-sm text-slate-500">Při neshodě bod naopak ztratí</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-300">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⏭️
          </span>
          <div>
            <p className="font-semibold text-slate-700">Přeskočit</p>
            <p className="text-sm text-slate-500">Otázku můžete přeskočit a nebude se do výpočtu počítat</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-300">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⭐
          </span>
          <div>
            <p className="font-semibold text-slate-700">Důležité otázky</p>
            <p className="text-sm text-slate-500">Pro vás důležité otázky označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-1 max-w-prose">
        <Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
          {calculator.methodology}
        </Markdown>
      </div>
    </div>
  );
}
