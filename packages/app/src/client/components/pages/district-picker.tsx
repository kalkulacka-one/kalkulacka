import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiHomeOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import { type EmbedContextType, HideOnEmbed } from "@/client/embeds";
import { EmbedFooter } from "@/components/embed-footer";
import { EmbedLayout } from "@/components/embed-layout";
import { Layout } from "@/components/layout";
import type { DistrictPickerViewModel } from "@/view-models";

import { AppHeader } from "../app-header";
import { DistrictPicker, DistrictPickerResults, DistrictPickerSearch } from "../district-picker";

export type DistrictPickerPage = {
  embedContext: EmbedContextType;
  picker: DistrictPickerViewModel;
  heading?: { title: string };
  backHref?: string;
  homepageHref: string;
  privacyHref?: string;
};

export function DistrictPickerPage({ embedContext, picker, heading, backHref, homepageHref, privacyHref }: DistrictPickerPage) {
  const t = useTranslations("koa.pages");

  const PageLayout = embedContext.isEmbed ? EmbedLayout : Layout;

  return (
    <DistrictPicker picker={picker}>
      <PageLayout>
        <PageLayout.Header>
          <div className="koa:bg-page/85 koa:backdrop-blur-md koa:border-b koa:border-border">
            <AppHeader heading={heading}>
              <AppHeader.Bottom>
                <AppHeader.BottomMain>
                  <div className="koa:flex koa:items-center koa:gap-3">
                    {backHref && (
                      <HideOnEmbed>
                        <Button variant="round" color="neutral" size="small" aria-label={t("districtPicker.home")} title={t("districtPicker.home")} onClick={() => window.location.assign(backHref)}>
                          <Icon icon={mdiHomeOutline} size="medium" decorative />
                        </Button>
                      </HideOnEmbed>
                    )}
                    <h2 className="koa:font-display koa:text-[1.75rem] koa:font-bold koa:leading-tight koa:tracking-[-0.03em] koa:text-text-strong koa:sm:text-[2rem]">
                      {picker.title ?? t("districtPicker.title")}
                    </h2>
                  </div>
                </AppHeader.BottomMain>
              </AppHeader.Bottom>
            </AppHeader>
            <div className="koa:mx-auto koa:grid koa:w-full koa:max-w-xl koa:gap-3 koa:px-2 koa:pb-3 koa:sm:px-4">
              <p className="koa:max-w-prose koa:text-[0.9375rem] koa:leading-relaxed koa:text-text-muted">{picker.description ?? t("districtPicker.description")}</p>
              <DistrictPickerSearch />
            </div>
          </div>
        </PageLayout.Header>
        <PageLayout.Content>
          <DistrictPickerResults />
        </PageLayout.Content>
        <PageLayout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</PageLayout.Footer>
      </PageLayout>
    </DistrictPicker>
  );
}
