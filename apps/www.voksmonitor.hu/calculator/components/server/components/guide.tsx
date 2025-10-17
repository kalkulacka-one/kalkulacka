import { mdiArrowRight, mdiStar } from "@mdi/js";
import { Icon } from "@repo/design-system/client";
import { logoCheck, logoCross } from "@repo/design-system/icons";
import { Card } from "@repo/design-system/server";
import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Guide = {
  calculator: CalculatorViewModel;
};

export function Guide({ calculator }: Guide) {
  return (
    <div className="grid gap-4">
      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={logoCheck} decorative={true} className="text-[var(--ko-palette-primary)]" />
          <div>
            <p className="font-semibold text-slate-700">Egyetért</p>
            <p className="text-sm text-slate-500">Amennyiben egy válasz megegyezik egy párt válaszával, az egy pontot ér.</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={logoCross} decorative={true} className="text-[var(--ko-palette-secondary)]" />
          <div>
            <p className="font-semibold text-slate-700">Nem ért egyet</p>
            <p className="text-sm text-slate-500">Amennyiben ellentétes a válasz, egy pontot levonunk.</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={mdiArrowRight} decorative={true} />
          <div>
            <p className="font-semibold text-slate-700">Kihagyás</p>
            <p className="text-sm text-slate-500">Amennyiben nincs álláspontod a témáról, vagy nem szeretnél válaszolni, a jobb oldalon található nyíllal továbbléphetsz. A kérdést nem vesszük figyelembe az eredmények kiszámításánál.</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={mdiStar} decorative={true} />
          <div>
            <p className="font-semibold text-slate-700">Fontos számomra</p>
            <p className="text-sm text-slate-500">Csillaggal jelölhetőek a kitöltő számára fontos témák. Ezeket a program dupla súllyal számítja.</p>
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
