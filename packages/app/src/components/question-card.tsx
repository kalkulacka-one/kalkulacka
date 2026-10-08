import { Icon, ToggleButton } from "@kalkulacka-one/design-system/client";
import { logoCheck, logoCross } from "@kalkulacka-one/design-system/icons";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";

import type { AnswerViewModel } from "@/view-models/answer";
import type { QuestionViewModel } from "@/view-models/question";

export type QuestionCard = {
  question: QuestionViewModel;
  answer: AnswerViewModel;
  onAgreeChange: (agree: boolean) => void;
  onDisagreeChange: (disagree: boolean) => void;
  onImportantChange: (isImportant: boolean) => void;
};

export function QuestionCard({ question, answer, onAgreeChange, onDisagreeChange, onImportantChange }: QuestionCard) {
  const t = useTranslations("koa.components.questionNavigationCard");
  const { title, detail, statement, tags } = question;

  return (
    <Card shadow={false} className="koa:flex koa:min-h-64 koa:flex-1 koa:flex-col koa:sm:max-h-[34rem] koa:rounded-card! koa:border koa:border-border koa:shadow-card">
      <div className="koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:gap-4 koa:pt-[clamp(20px,14.4898px+1.4694vw,38px)] koa:px-[clamp(18px,12.4898px+1.4694vw,36px)] koa:pb-[clamp(18px,13.7143px+1.1429vw,32px)]">
        <div
          key={question.id}
          className="koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:gap-4 koa:overflow-y-auto koa:pb-6 koa:[mask-image:linear-gradient(to_bottom,black_calc(100%_-_1.5rem),transparent)]"
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

          <div className="koa:flex koa:flex-col koa:gap-3">
            <h3 className="koa:font-sans koa:text-[clamp(23px,14.89px+2.162vw,28.73px)] koa:sm:text-[clamp(27px,24.551px+0.6531vw,35px)] koa:font-bold koa:text-text koa:leading-[1.22] koa:tracking-[-0.03em] koa:break-words">
              {statement}
            </h3>
            {detail && <p className="koa:text-[clamp(15px,14.5px+0.12vw,17px)] koa:text-text-muted koa:leading-[1.5] koa:sm:leading-[1.62] koa:break-words">{detail}</p>}
          </div>
        </div>

        <div className="koa:@container koa:shrink-0 koa:grid koa:grid-cols-[auto_1fr_1fr] koa:gap-3 koa:items-center">
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
