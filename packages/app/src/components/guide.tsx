import { Icon } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiArrowRight, mdiStar } from "@mdi/js";
import { useTranslations } from "next-intl";
import Markdown from "react-markdown";

import type { CalculatorViewModel } from "@/view-models/calculator";

export type Guide = {
  calculator: CalculatorViewModel;
};

export function Guide({ calculator }: Guide) {
  const t = useTranslations("koa.components.guide");

  return (
    <div className="koa:grid koa:gap-4">
      <Card shadow="hard" className="koa:border koa:border-slate-200">
        <div className="koa:flex koa:items-start koa:gap-3 koa:px-6 koa:py-4 koa:max-w-prose">
          <Icon icon={logoCheck} decorative={true} className="koa:text-[var(--ko-palette-primary)]" />
          <div>
            <p className="koa:font-semibold koa:text-slate-700">{t("agreement.title")}</p>
            <p className="koa:text-sm koa:text-slate-500">{t("agreement.description")}</p>
          </div>
        </div>
      </Card>
      <Card shadow="hard" className="koa:border koa:border-slate-200">
        <div className="koa:flex koa:items-start koa:gap-3 koa:px-6 koa:py-4 koa:max-w-prose">
          <Icon icon={logoCross} decorative={true} className="koa:text-[var(--ko-palette-secondary)]" />
          <div>
            <p className="koa:font-semibold koa:text-slate-700">{t("disagreement.title")}</p>
            <p className="koa:text-sm koa:text-slate-500">{t("disagreement.description")}</p>
          </div>
        </div>
      </Card>
      <Card shadow="hard" className="koa:border koa:border-slate-200">
        <div className="koa:flex koa:items-start koa:gap-3 koa:px-6 koa:py-4 koa:max-w-prose">
          <Icon icon={mdiArrowRight} decorative={true} />
          <div>
            <p className="koa:font-semibold koa:text-slate-700">{t("skip.title")}</p>
            <p className="koa:text-sm koa:text-slate-500">{t("skip.description")}</p>
          </div>
        </div>
      </Card>
      <Card shadow="hard" className="koa:border koa:border-slate-200">
        <div className="koa:flex koa:items-start koa:gap-3 koa:px-6 koa:py-4 koa:max-w-prose">
          <Icon icon={mdiStar} decorative={true} className="koa:text-yellow-400" />
          <div>
            <p className="koa:font-semibold koa:text-slate-700">{t("important.title")}</p>
            <p className="koa:text-sm koa:text-slate-500">{t("important.description")}</p>
          </div>
        </div>
      </Card>
      <div className="koa:grid koa:gap-1 koa:max-w-prose">
        <Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
          {calculator.methodology}
        </Markdown>
      </div>
    </div>
  );
}
