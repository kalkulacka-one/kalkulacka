import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { EmbedContextType } from "@/client/embeds";
import { DropLauncherParam } from "@/client/launcher";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import type { CalculatorPickerViewModel } from "@/view-models";

import { AppHeader } from "../app-header";
import { CalculatorPickerCards } from "../calculator-picker-cards";

export type CalculatorPickerPage = {
  embedContext: EmbedContextType;
  picker: CalculatorPickerViewModel;
  heading?: { title: string };
  backHref?: string;
  homepageHref: string;
  privacyHref?: string;
};

export function CalculatorPickerPage({ embedContext, picker, heading, backHref, homepageHref, privacyHref }: CalculatorPickerPage) {
  const t = useTranslations("koa.pages");

  return (
    <Layout>
      {/* Web only: the embed needs `from` to survive browser back, or this picker would lose its back link. */}
      {!embedContext.isEmbed && <DropLauncherParam />}
      <Layout.Header>
        <AppHeader heading={heading}>
          <AppHeader.Bottom>
            <AppHeader.BottomMain>
              <div className="koa:flex koa:items-center koa:gap-3">
                {backHref && (
                  <Button variant="round" color="neutral" size="small" aria-label={t("calculatorPicker.back")} title={t("calculatorPicker.back")} href={backHref}>
                    <Icon icon={mdiArrowLeft} size="medium" decorative />
                  </Button>
                )}
                <h2 className="koa:font-display koa:text-[1.75rem] koa:font-bold koa:leading-tight koa:tracking-[-0.03em] koa:text-text-strong koa:sm:text-[2rem]">{picker.title}</h2>
              </div>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <p className="koa:mb-4 koa:max-w-prose koa:text-text-muted">{t("calculatorPicker.description")}</p>
        <CalculatorPickerCards cards={picker.cards} startLabel={t("calculatorPicker.start")} unavailableLabel={t("districtPicker.unavailable")} />
      </Layout.Content>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
