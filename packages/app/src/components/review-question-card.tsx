import { Dialog, Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { AnswerViewModel, QuestionViewModel } from "@/view-models";

export type ReviewQuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

// How long a chosen answer stays visible as selected before the dialog closes.
const HOLD_MS = 120;

const chipClasses = "koa:inline-flex koa:items-center koa:rounded-chip koa:px-2.5 koa:py-1 koa:text-sm koa:leading-[1.2] koa:font-medium koa:text-text";

/**
 * Recap row, as in 2026: the star, the question's title and the answer it got. Tapping the title or the answer opens the
 * whole question in a dialog, where the answer can be changed. Keeping Ano and Ne out of the rows leaves two tab stops
 * per row instead of three, and nothing for a thumb to mis-tap while scrolling a list of forty.
 */
export function ReviewQuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: ReviewQuestionCard) {
  const t = useTranslations("koa.components.reviewQuestionCard");
  const tPages = useTranslations("koa.pages");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const { title, statement, detail, tags } = question;
  const isYes = answer.answer?.answer === true;
  const isNo = answer.answer?.answer === false;
  const isImportant = answer.answer?.isImportant === true;
  // Visited and passed over: the store holds an entry for the question, with no answer. Like 2026, such a row reads as
  // secondary and its star is off: skipping clears "important", and arming it without the question in front of you
  // would attach it to a position that was never taken (the dialog's star is still there for that).
  const isSkipped = answer.answer !== undefined && answer.answer.answer === undefined;

  // Choosing an answer closes the dialog after a beat, like the question screen moves on; un-choosing it doesn't.
  const handleAnswer = (change: (checked: boolean) => void) => (checked: boolean) => {
    change(checked);
    if (checked) {
      closeTimer.current = setTimeout(() => setOpen(false), HOLD_MS);
    }
  };

  return (
    <div>
      {/*
       * 2026's recap tile: a flat surface lifted by a soft shadow rather than ringed by a border, so the list reads as
       * pieces resting on the page. Star on the left, title in the middle (two lines at most), the answer on the right.
       * The star is its own control: it toggles right here, without opening the question. Everything else is one
       * button that opens the whole question, and it reaches out to the tile's edges so the hit area isn't just the text.
       */}
      <div className="koa:grid koa:grid-cols-[auto_minmax(0,1fr)] koa:items-center koa:gap-2.5 koa:rounded-control koa:bg-surface koa:p-2.5 koa:shadow-surface koa:transition-transform koa:duration-fast koa:has-active:scale-[0.985]">
        <span className={isSkipped ? "koa:opacity-45" : undefined}>
          <ToggleButton
            size="xsmall"
            color="neutral"
            variant="round"
            checked={isImportant}
            disabled={isSkipped}
            onChange={(checked: boolean) => onImportantChange(checked)}
            aria-label={t("important")}
          >
            <Icon icon={isImportant ? mdiStar : mdiStarOutline} size="small" decorative={true} />
          </ToggleButton>
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="koa:-my-2.5 koa:-mr-2.5 koa:flex koa:min-h-14 koa:min-w-0 koa:cursor-pointer koa:items-center koa:justify-between koa:gap-3 koa:rounded-control koa:py-2.5 koa:pr-2.5 koa:text-left"
        >
          <span
            className={`koa:line-clamp-2 koa:min-w-0 koa:font-sans koa:text-[15px] koa:leading-[1.3] koa:tracking-[-0.01em] koa:break-words koa:sm:text-[17px] ${isSkipped ? "koa:font-medium koa:text-text-muted" : "koa:font-semibold koa:text-text-strong"}`}
          >
            {title}
            {isYes && <span className="koa:sr-only"> – {t("yes")}</span>}
            {isNo && <span className="koa:sr-only"> – {t("no")}</span>}
            {isImportant && <span className="koa:sr-only"> – {t("important")}</span>}
          </span>
          <span
            aria-hidden="true"
            className={`koa:flex koa:size-[2.125rem] koa:shrink-0 koa:items-center koa:justify-center koa:rounded-full ${
              isYes ? "koa:bg-primary koa:text-on-bg-primary" : isNo ? "koa:bg-secondary koa:text-on-bg-secondary" : "koa:border koa:border-dashed koa:border-text-muted/50"
            }`}
          >
            {isYes && <Icon icon={logoCheck} className="koa:size-4! koa:min-w-0!" decorative />}
            {isNo && <Icon icon={logoCross} className="koa:size-4! koa:min-w-0!" decorative />}
          </span>
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        closeLabel={tPages("common.close")}
        title={statement}
        eyebrow={
          <div className="koa:flex koa:flex-wrap koa:gap-2">
            {tags?.map((tag) => (
              <span key={tag} className={`${chipClasses} koa:bg-surface-sunken`}>
                {tag}
              </span>
            ))}
            <span className={`${chipClasses} koa:border koa:border-border`}>{title}</span>
          </div>
        }
      >
        {detail && <p className="koa:text-[clamp(15px,14.5px+0.12vw,17px)] koa:leading-[1.5] koa:text-text-muted koa:break-words">{detail}</p>}
        <div className="koa:@container koa:mt-2 koa:grid koa:grid-cols-[auto_1fr_1fr] koa:items-center koa:gap-3">
          <ToggleButton variant="round" color="neutral" checked={isImportant} onChange={(checked: boolean) => onImportantChange(checked)} aria-label={t("important")}>
            <Icon icon={isImportant ? mdiStar : mdiStarOutline} decorative={true} />
          </ToggleButton>
          <ToggleButton variant="answer" color="primary" checked={isYes} onChange={handleAnswer(onAgreeChange)} aria-label={t("yes")}>
            <Icon icon={logoCheck} decorative={true} />
            <span className="koa:hidden koa:@min-[264px]:inline">{t("yes")}</span>
          </ToggleButton>
          <ToggleButton variant="answer" color="secondary" checked={isNo} onChange={handleAnswer(onDisagreeChange)} aria-label={t("no")}>
            <Icon icon={logoCross} decorative={true} />
            <span className="koa:hidden koa:@min-[264px]:inline">{t("no")}</span>
          </ToggleButton>
        </div>
      </Dialog>
    </div>
  );
}
