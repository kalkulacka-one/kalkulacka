export type QuestionProgress = {
  current: number;
  total: number;
};

/**
 * A segmented progress bar under the header: one segment per question, the
 * current one highlighted.
 *
 * Purely decorative — `aria-hidden` — because it only ever shows position,
 * never per-question answered state (this page's props carry `number`/`total`
 * alone), and that same position is already spoken through the "N/total"
 * counter in the step row below the card. A screen reader hearing both would
 * hear the same fact twice.
 */
export function QuestionProgress({ current, total }: QuestionProgress) {
  return (
    <div className="koa:flex koa:min-w-0 koa:gap-1" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => {
        const isCurrent = index === current - 1;
        // biome-ignore lint/suspicious/noArrayIndexKey: segments are a fixed-length, purely positional list — nothing is ever reordered or inserted.
        return (
          <span key={index} className={isCurrent ? "koa:h-1.5 koa:min-w-3 koa:flex-[3_1_0] koa:rounded-pill koa:bg-neutral" : "koa:h-1.5 koa:min-w-0.5 koa:flex-1 koa:rounded-pill koa:bg-border"} />
        );
      })}
    </div>
  );
}
