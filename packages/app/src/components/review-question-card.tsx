import { Dialog, Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiChevronRight, mdiStar, mdiStarOutline } from "@mdi/js";
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
 * Recap row: just the question's title and how it was answered. Tapping it opens the whole question in a dialog, where
 * the answer (and the star) can be changed. Keeping the controls out of the rows leaves one tab stop per row instead
 * of three, and nothing for a thumb to mis-tap while scrolling a list of forty.
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

  // Choosing an answer closes the dialog after a beat, like the question screen moves on; un-choosing it doesn't.
  const handleAnswer = (change: (checked: boolean) => void) => (checked: boolean) => {
    change(checked);
    if (checked) {
      closeTimer.current = setTimeout(() => setOpen(false), HOLD_MS);
    }
  };

  return (
    <Card shadow={false} className="koa:rounded-card! koa:border koa:border-border koa:shadow-card">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="koa:flex koa:min-h-16 koa:w-full koa:cursor-pointer koa:items-center koa:gap-3 koa:rounded-card koa:px-4 koa:py-3 koa:text-left koa:sm:px-5 koa:sm:py-4"
      >
        <span
          aria-hidden="true"
          className={`koa:flex koa:size-9 koa:shrink-0 koa:items-center koa:justify-center koa:rounded-full koa:border-[1.5px] ${
            isYes
              ? "koa:border-primary koa:bg-primary koa:text-on-bg-primary"
              : isNo
                ? "koa:border-secondary koa:bg-secondary koa:text-on-bg-secondary"
                : "koa:border-dashed koa:border-border koa:text-text-muted"
          }`}
        >
          {isYes && <Icon icon={logoCheck} size="small" decorative />}
          {isNo && <Icon icon={logoCross} size="small" decorative />}
        </span>
        <span className="koa:min-w-0 koa:flex-1 koa:font-sans koa:text-[15px] koa:font-semibold koa:leading-snug koa:text-text koa:break-words koa:sm:text-[17px]">
          {title}
          {isYes && <span className="koa:sr-only"> – {t("yes")}</span>}
          {isNo && <span className="koa:sr-only"> – {t("no")}</span>}
          {isImportant && <span className="koa:sr-only"> – {t("important")}</span>}
        </span>
        {isImportant && <Icon icon={mdiStar} className="koa:shrink-0 koa:text-text-strong" size="medium" decorative />}
        <Icon icon={mdiChevronRight} className="koa:shrink-0 koa:text-text-muted" size="medium" decorative />
      </button>

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
    </Card>
  );
}
