import { Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { type EmbedContextType, HideOnEmbed } from "@/client/embeds";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import type { CalculatorPickerViewModel } from "@/view-models";

import { AppHeader } from "../app-header";
import { CalculatorPickerCards } from "../calculator-picker-cards";

export type CalculatorPickerPage = {
  embedContext: EmbedContextType;
  picker: CalculatorPickerViewModel;
  heading?: { title: string };
  closeHref?: string;
  homepageHref: string;
  privacyHref?: string;
};

export function CalculatorPickerPage({ embedContext, picker, heading, closeHref, homepageHref, privacyHref }: CalculatorPickerPage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader heading={heading}>
          <AppHeader.Right>
            {closeHref && (
              <HideOnEmbed>
                <a href={closeHref} aria-label={t("common.close")} className="koa:inline-grid koa:place-items-center koa:size-10 koa:rounded-full koa:text-slate-700 koa:hover:bg-slate-100">
                  <Icon icon={mdiClose} size="medium" decorative />
                </a>
              </HideOnEmbed>
            )}
          </AppHeader.Right>
          <AppHeader.Bottom>
            <AppHeader.BottomMain>
              <h2 className="koa:font-display koa:text-[1.75rem] koa:font-bold koa:leading-tight koa:tracking-[-0.03em] koa:text-slate-800 koa:sm:text-[2rem]">{picker.title}</h2>
            </AppHeader.BottomMain>
          </AppHeader.Bottom>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <p className="koa:mb-4 koa:max-w-prose koa:text-slate-600">{t("calculatorPicker.description")}</p>
        <CalculatorPickerCards cards={picker.cards} startLabel={t("calculatorPicker.start")} unavailableLabel={t("districtPicker.unavailable")} />
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
