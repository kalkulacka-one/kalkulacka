import { Button } from "@kalkulacka-one/design-system/client";

import { useTranslations } from "next-intl";

/**
 * The 2026 look keeps only one control down here: sharing already lives in the
 * top pill (see `result.tsx`), so a second "Sdílet" at the bottom was a
 * duplicate, not a second action. "Porovnat" sits in the page's own normal
 * flow, under the list, as a light pill — never a `position: fixed` bar, which
 * iOS Safari's glass bar clips on phones.
 */
export type ResultNavigationCard = {
  onNextClick: () => void;
};

export function ResultNavigationCard({ onNextClick }: ResultNavigationCard) {
  const t = useTranslations("koa.components.resultNavigationCard");

  return (
    <div className="koa:flex koa:justify-center koa:sm:justify-start">
      <Button variant="pill" color="neutral" onClick={onNextClick}>
        {t("compareButton")}
      </Button>
    </div>
  );
}
