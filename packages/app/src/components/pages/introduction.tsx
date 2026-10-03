import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { IconBadge } from "@kalkulacka-one/design-system/server";

import { mdiClose, mdiFormatListChecks, mdiSkipNext, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import { AppHeader, type EmbedContextType, HideOnEmbed } from "@/client";
import { EmbedFooter } from "@/components/embed-footer";
import { Introduction } from "@/components/introduction";
import { IntroductionNavigationCard } from "@/components/introduction-navigation-card";
import { Layout } from "@/components/layout";
import type { CalculatorViewModel } from "@/view-models";

export type IntroductionPage = {
  embedContext: EmbedContextType;
  homepageHref: string;
  privacyHref?: string;
  calculator: CalculatorViewModel;
  onNextClick: () => void;
  onCloseClick: () => void;
};

export function IntroductionPage({ embedContext, homepageHref, privacyHref, calculator, onNextClick, onCloseClick }: IntroductionPage) {
  const t = useTranslations("koa.pages");
  const hasFooter = embedContext.isEmbed && embedContext.config?.attribution !== false;

  return (
    <Layout>
      <Layout.Header>
        <AppHeader calculator={calculator}>
          <AppHeader.Right>
            <HideOnEmbed>
              <Button variant="round" color="neutral" size="small" aria-label={t("common.close")} onClick={onCloseClick}>
                <Icon icon={mdiClose} size="medium" decorative />
              </Button>
            </HideOnEmbed>
          </AppHeader.Right>
        </AppHeader>
      </Layout.Header>
      <Layout.Content>
        <h2 className="koa:font-display koa:font-bold koa:text-display koa:tracking-tight koa:text-text koa:mb-2 koa:sm:mb-3">{calculator?.shortTitle}</h2>
        <Introduction calculator={calculator} />
        {/* PROTOTYPE copy (hard-coded Czech, taken from the 2026 reference's intro facts) — real copy needs locale keys. */}
        <ul className="koa:mt-6 koa:sm:mt-8 koa:grid koa:max-w-prose koa:gap-5">
          {[
            { icon: mdiStarOutline, title: "Pro mě důležité", text: "Otázku, na které vám obzvlášť záleží, můžete označit hvězdičkou. Ve výsledku pak má dvojnásobnou váhu." },
            { icon: mdiSkipNext, title: "Přeskočení", text: "Pokud nevíte, nebo vám je to jedno, otázku přeskočte. Do výsledku se nezapočítá." },
            { icon: mdiFormatListChecks, title: "Rekapitulace", text: "Na konci uvidíte všechny otázky pohromadě. Odpovědi můžete ještě změnit a označit důležité otázky." },
          ].map((fact) => (
            <li key={fact.title} className="koa:grid koa:grid-cols-[auto_1fr] koa:items-start koa:gap-4">
              <IconBadge color="neutral" variant="tint" size="medium">
                <Icon icon={fact.icon} decorative />
              </IconBadge>
              <div className="koa:grid koa:gap-0.5">
                <p className="koa:font-semibold koa:text-text">{fact.title}</p>
                <p className="koa:text-text-muted koa:leading-[1.5]">{fact.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Layout.Content>
      {hasFooter && <Layout.BottomSpacer className={`${EmbedFooter.heightClassNames} koa:lg:hidden`} />}
      <Layout.BottomNavigation className={hasFooter ? EmbedFooter.navOffsetClassNames : undefined}>
        <IntroductionNavigationCard onNextClick={onNextClick} />
      </Layout.BottomNavigation>
      <Layout.Footer>{embedContext.isEmbed && <EmbedFooter attribution={embedContext.config?.attribution} homepageHref={homepageHref} privacyHref={privacyHref} />}</Layout.Footer>
    </Layout>
  );
}
