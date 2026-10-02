import Markdown from "react-markdown";

import type { CalculatorViewModel } from "@/view-models/calculator";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="koa:-mx-2 koa:px-gutter koa:pt-[clamp(8px,1.8776px+1.6327vw,28px)] koa:sm:mx-0 koa:sm:px-0 koa:grid koa:gap-3 koa:sm:gap-4 koa:max-w-prose koa:text-base koa:leading-[1.55] koa:text-text-muted">
      <Markdown
        allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]}
        skipHtml
        components={{
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="koa:text-primary koa:hover:text-primary-hover koa:underline koa:hover:no-underline" target="_blank" rel="noopener noreferrer">
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
