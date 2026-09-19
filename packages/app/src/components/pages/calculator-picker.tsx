import { Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, AppHeaderBottom, AppHeaderBottomMain, AppHeaderRight, CalculatorPickerCards, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import type { CalculatorPickerViewModel } from "@/view-models";

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
          <AppHeaderRight>
            {closeHref && (
              <HideOnEmbed>
                <a href={closeHref} aria-label={t("common.close")} className="koa:inline-grid koa:place-items-center koa:size-10 koa:rounded-full koa:text-slate-700 koa:hover:bg-slate-100">
                  <Icon icon={mdiClose} size="medium" decorative />
                </a>
              </HideOnEmbed>
            )}
          </AppHeaderRight>
          <AppHeaderBottom>
            <AppHeaderBottomMain>
              <h2 className="koa:font-display koa:text-[1.75rem] koa:font-bold koa:leading-tight koa:tracking-[-0.03em] koa:text-slate-800 koa:sm:text-[2rem]">{picker.title}</h2>
            </AppHeaderBottomMain>
          </AppHeaderBottom>
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
