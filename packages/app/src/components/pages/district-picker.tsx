import { Icon } from "@kalkulacka-one/design-system/client";

import { mdiClose } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, AppHeaderBottom, AppHeaderBottomMain, AppHeaderRight, DistrictPicker, DistrictPickerResults, DistrictPickerSearch, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Layout } from "@/components/layout";
import type { DistrictPickerViewModel } from "@/view-models";

export type DistrictPickerPage = {
  embedContext: EmbedContextType;
  picker: DistrictPickerViewModel;
  heading?: { title: string };
  closeHref?: string;
  homepageHref: string;
  privacyHref?: string;
};

export function DistrictPickerPage({ embedContext, picker, heading, closeHref, homepageHref, privacyHref }: DistrictPickerPage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <DistrictPicker picker={picker}>
      <Layout>
        <Layout.Header>
          <div className="koa:bg-slate-50/85 koa:backdrop-blur-md koa:shadow-[0_1px_0_0_rgba(15,23,42,0.06)]">
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
                  <h2 className="koa:font-display koa:text-[1.75rem] koa:font-bold koa:leading-tight koa:tracking-[-0.03em] koa:text-slate-800 koa:sm:text-[2rem]">
                    {picker.title ?? t("districtPicker.title")}
                  </h2>
                </AppHeaderBottomMain>
              </AppHeaderBottom>
            </AppHeader>
            <div className="koa:mx-auto koa:grid koa:w-full koa:max-w-xl koa:gap-3 koa:px-2 koa:pb-3 koa:sm:px-4">
              <p className="koa:max-w-prose koa:text-[0.9375rem] koa:leading-relaxed koa:text-slate-500">{picker.description ?? t("districtPicker.description")}</p>
              <DistrictPickerSearch />
            </div>
          </div>
        </Layout.Header>
        <Layout.Content>
          <DistrictPickerResults />
        </Layout.Content>
        {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
        <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
      </Layout>
    </DistrictPicker>
  );
}
