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
      <button
        type="button"
        onClick={onNextClick}
        className="koa:inline-flex koa:items-center koa:justify-center koa:rounded-pill koa:border koa:border-border koa:bg-surface koa:px-6 koa:py-3 koa:text-sm koa:font-semibold koa:text-text koa:hover:bg-surface-hover koa:transition-colors"
      >
        {t("compareButton")}
      </button>
    </div>
  );
}
