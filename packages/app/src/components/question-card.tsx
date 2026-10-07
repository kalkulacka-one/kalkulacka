import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef, useState } from "react";

import type { AnswerViewModel } from "@/view-models/answer";
import type { QuestionViewModel } from "@/view-models/question";

export type QuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
  // Fill the height it is given instead of sizing to the text (embeds): the topic and statement stay put, and a
  // detail too long for the space scrolls inside the card with a fade showing there is more.
  fit?: boolean;
};

function useOverflows<T extends HTMLElement>(deps: unknown[]) {
  const ref = useRef<T>(null);
  const [overflows, setOverflows] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setOverflows(el.scrollHeight - el.scrollTop - el.clientHeight > 1);
    update();
    el.scrollTop = 0;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure when the question changes
  }, deps);
  return { ref, overflows };
}

/**
 * The one card in the answering flow: chips, statement, detail, and — always
 * pinned to the card's own bottom, in thumb reach on a phone — the answer row.
 *
 * The card never scrolls on its own. On a phone it stretches to the column so
 * the answer row stays at the bottom of the screen; from `sm` up it has a
 * minimum height, so the answer row stays in the same place from question to
 * question and the text just starts at the top. Only a question longer than
 * that minimum grows the card. The minimum is capped at the viewport minus
 * the chrome around the card (header, progress bar, step row, paddings and
 * the embed footer's spacer, ~17rem), so a 600px partner iframe or a short
 * laptop screen still shows the answer and step rows without scrolling.
 *
 * `mb-2` below is deliberate, not decorative: the step row sits in the same
 * flex column right after this card (see pages/question.tsx), and without it
 * the two touch — this is the only thing giving the row its own breathing
 * room above it rather than reading as glued to the card's bottom edge.
 */
export function QuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange, fit = false }: QuestionCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const { title, detail, statement, tags } = question;
  const detailScroll = useOverflows<HTMLParagraphElement>([question.id]);

  return (
    <Card
      shadow={false}
      className={
        fit
          ? "koa:flex koa:flex-1 koa:min-h-0 koa:flex-col koa:rounded-card! koa:border koa:border-border koa:shadow-card"
          : "koa:flex koa:flex-1 koa:flex-col koa:rounded-card! koa:border koa:border-border koa:shadow-card koa:mb-2 koa:sm:mb-0 koa:sm:flex-none koa:sm:min-h-[min(34rem,100dvh_-_17rem)]"
      }
    >
      <div
        className={
          fit
            ? "koa:flex koa:flex-1 koa:min-h-0 koa:flex-col koa:gap-3 koa:pt-4 koa:px-[clamp(16px,12.4898px+1.4694vw,28px)] koa:pb-4"
            : "koa:flex koa:flex-1 koa:flex-col koa:gap-4 koa:pt-[clamp(20px,14.4898px+1.4694vw,38px)] koa:px-[clamp(18px,12.4898px+1.4694vw,36px)] koa:pb-[clamp(18px,13.7143px+1.1429vw,32px)]"
        }
      >
        <div className="koa:flex koa:flex-wrap koa:gap-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="koa:hidden koa:sm:inline-flex koa:items-center koa:rounded-chip koa:bg-surface-sunken koa:px-2.5 koa:py-1 koa:text-[clamp(13.5px,13.1939px+0.0816vw,14.5px)] koa:leading-[1.2] koa:font-medium koa:text-text"
            >
              {tag}
            </span>
          ))}
          <span className="koa:inline-flex koa:items-center koa:rounded-chip koa:border koa:border-border koa:px-2.5 koa:py-1 koa:text-[clamp(13.5px,13.1939px+0.0816vw,14.5px)] koa:leading-[1.2] koa:font-medium koa:text-text">
            {title}
          </span>
        </div>

        <div className={fit ? "koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:gap-2" : "koa:flex koa:flex-col koa:gap-3"}>
          <h3 className="koa:font-sans koa:text-[clamp(23px,14.89px+2.162vw,28.73px)] koa:sm:text-[clamp(27px,24.551px+0.6531vw,35px)] koa:font-bold koa:text-text koa:leading-[1.22] koa:tracking-[-0.03em] koa:break-words">
            {statement}
          </h3>
          {detail && (
            <p
              ref={detailScroll.ref}
              tabIndex={fit && detailScroll.overflows ? 0 : undefined}
              className={
                fit
                  ? `koa:min-h-0 koa:overflow-y-auto koa:text-[clamp(15px,14.5px+0.12vw,17px)] koa:text-text-muted koa:leading-[1.5] koa:break-words ${detailScroll.overflows ? "koa:[mask-image:linear-gradient(to_bottom,black_calc(100%-2.5rem),transparent)]" : ""}`
                  : "koa:text-[clamp(15px,14.5px+0.12vw,17px)] koa:text-text-muted koa:leading-[1.5] koa:sm:leading-[1.62] koa:break-words"
              }
            >
              {detail}
            </p>
          )}
        </div>

        <div className="koa:@container koa:mt-auto koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-3 koa:items-center">
          <ToggleButton variant="round" color="neutral" checked={answer.answer?.isImportant || false} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
            <Icon icon={answer.answer?.isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={answer.answer?.answer === true} onChange={(checked: boolean) => onAgreeChange(checked)} aria-label={t("yes")}>
            <Icon icon={logoCheck} decorative={true} />
            <span className="koa:hidden koa:@min-[264px]:inline">{t("yes")}</span>
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={answer.answer?.answer === false} onChange={(checked: boolean) => onDisagreeChange(checked)} aria-label={t("no")}>
            <Icon icon={logoCross} decorative={true} />
            <span className="koa:hidden koa:@min-[264px]:inline">{t("no")}</span>
          </ToggleButton>
        </div>
      </div>
    </Card>
  );
}
