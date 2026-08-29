"use client";

import { Icon } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiArrowRight, mdiStar } from "@mdi/js";
import { useTranslations } from "next-intl";
import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Guide = {
  calculator: CalculatorViewModel;
};

export function Guide({ calculator }: Guide) {
  const t = useTranslations("calculator.guide");
  return (
    <div className="grid gap-4">
      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={logoCheck} decorative={true} className="text-[var(--ko-palette-primary)]" />
          <div>
            <p className="font-semibold text-slate-700">{t("agree-label")}</p>
            <p className="text-sm text-slate-500">{t("agree-description")}</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={logoCross} decorative={true} className="text-[var(--ko-palette-secondary)]" />
          <div>
            <p className="font-semibold text-slate-700">{t("disagree-label")}</p>
            <p className="text-sm text-slate-500">{t("disagree-description")}</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={mdiArrowRight} decorative={true} />
          <div>
            <p className="font-semibold text-slate-700">{t("skip-label")}</p>
            <p className="text-sm text-slate-500">{t("skip-description")}</p>
          </div>
        </div>
      </Card>

      <Card shadow="hard" className="border border-slate-200">
        <div className="flex items-start gap-3 px-6 py-4 max-w-prose">
          <Icon icon={mdiStar} decorative={true} />
          <div>
            <p className="font-semibold text-slate-700">{t("important-label")}</p>
            <p className="text-sm text-slate-500">{t("important-description")}</p>
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
