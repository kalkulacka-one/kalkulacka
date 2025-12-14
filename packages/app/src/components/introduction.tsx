import Markdown from "react-markdown";

import type { CalculatorViewModel } from "@/view-models/calculator";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="koa:grid koa:gap-2 koa:max-w-prose koa:text-slate-600">
      <Markdown
        allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a href={href} className="koa:text-[var(--ko-color-primary)] koa:hover:text-[var(--ko-color-primary-hover)] koa:underline koa:hover:no-underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {intro}
      </Markdown>
    </div>
  );
}
