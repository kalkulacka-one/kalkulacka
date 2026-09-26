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
 */
export function QuestionNavigationCard({ current, total, isAnswered, onPreviousClick, onNextClick }: QuestionNavigationCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const previousButtonLabel = current === 1 ? t("guide") : t("previous");
  const nextButtonLabel = isAnswered ? t("next") : t("skip");

  return (
    <div className="koa:grid koa:grid-cols-[1fr_1fr] koa:@[350px]:grid-cols-[minmax(8rem,1fr)_auto_minmax(8rem,1fr)] koa:items-center koa:gap-1 koa:@sm:gap-2">
      <div className="koa:justify-self-start">
        <Button size="small" variant="link" color="neutral" onClick={onPreviousClick}>
          <Icon icon={mdiArrowLeft} decorative={true} />
          {previousButtonLabel}
        </Button>
      </div>
      <div className="koa:hidden koa:justify-self-center koa:text-sm koa:text-text-subtle koa:tabular-nums koa:@[350px]:block">
        <span className="koa:whitespace-nowrap">
          <strong className="koa:text-text-muted">{current}</strong>/{total}
        </span>
      </div>
      <div className="koa:justify-self-end">
        <Button size="small" variant="link" color="neutral" onClick={onNextClick}>
          {nextButtonLabel}
          <Icon icon={mdiArrowRight} decorative={true} />
        </Button>
      </div>
    </div>
  );
}
