import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import { useTranslations } from "next-intl";

export type QuestionNavigationCard = {
  current: number;
  total: number;
  isAnswered: boolean;
  onPreviousClick: () => void;
  onNextClick: () => void;
};

/**
 * The quiet step row under the question card: back, position, forward — as
 * plain text buttons rather than another card, so it reads as a footnote to
 * the card above it instead of a second surface competing with it.
 *
 * Sized to fit a 360–375px phone: the link buttons' 16px side padding is
 * outside the card by widening the row (`-mx-4.5`, the phone gutter), so the arrows sit on the
 * card's own edges instead of 16px inside them, and the text scales down a little
 * on narrow screens, because at a fixed 17px this row alone needed ~352px and
 * was widening the whole page on an iPhone 12 mini. The `minmax(0, 1fr)`
 * columns keep a long translated label from doing that again.
 */
export function QuestionNavigationCard({ current, total, isAnswered, onPreviousClick, onNextClick }: QuestionNavigationCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const previousButtonLabel = current === 1 ? t("guide") : t("previous");
  const nextButtonLabel = isAnswered ? t("next") : t("skip");

  return (
    <div className="koa:-mx-4.5 koa:shrink-0 koa:grid koa:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] koa:items-center koa:gap-1 koa:sm:gap-2">
      <div className="koa:justify-self-start">
        <Button size="small" variant="link" color="neutral" onClick={onPreviousClick}>
          <span className="koa:flex koa:items-center koa:gap-1 koa:text-[clamp(14px,4.5vw,17px)] koa:font-bold koa:text-text">
            <Icon icon={mdiArrowLeft} decorative={true} />
            {previousButtonLabel}
          </span>
        </Button>
      </div>
      <div className="koa:justify-self-center koa:text-[clamp(14px,4.5vw,17px)] koa:text-text-subtle koa:tabular-nums">
        <span className="koa:whitespace-nowrap">
          <strong className="koa:font-bold koa:text-text-strong">{current}</strong>/{total}
        </span>
      </div>
      <div className="koa:justify-self-end">
        <Button size="small" variant="link" color="neutral" onClick={onNextClick}>
          <span className="koa:flex koa:items-center koa:gap-1 koa:text-[clamp(14px,4.5vw,17px)] koa:font-bold koa:text-text">
            {nextButtonLabel}
            <Icon icon={mdiArrowRight} decorative={true} />
          </span>
        </Button>
      </div>
    </div>
  );
}
