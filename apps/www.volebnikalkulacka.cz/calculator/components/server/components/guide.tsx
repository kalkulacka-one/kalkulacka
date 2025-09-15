import { Card } from "@repo/design-system/server";
import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Guide = {
  calculator: CalculatorViewModel;
};

export function Guide({ calculator }: Guide) {
  return (
    <div className="grid gap-4">
      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ✅
          </span>
          <div>
            <p className="font-semibold">Shoda</p>
            <p className="text-sm">Při shodě s Vaší odpovědí strana nebo politik "dostane bod"</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ❌
          </span>
          <div>
            <p className="font-semibold">Neshoda</p>
            <p className="text-sm">Při neshodě bod naopak ztratí</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⏭️
          </span>
          <div>
            <p className="font-semibold">Přeskočit</p>
            <p className="text-sm">Otázku můžete přeskočit a nebude se do výpočtu počítat</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            ⭐
          </span>
          <div>
            <p className="font-semibold">Důležité otázky</p>
            <p className="text-sm">Otázky, které jsou pro vás důležité, označte hvězdičkou. Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <span className="text-2xl" aria-hidden="true">
            %
          </span>
          <div>
            <p className="font-semibold">Konečný výsledek shody</p>
            <p className="text-sm">Na závěr se tyto body přepočtou na škálu 0 až 100 %.</p>
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
