import Markdown from "react-markdown";

import type { CalculatorViewModel } from "@/view-models/calculator";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="koa:-mx-2 koa:px-fluid-gutter koa:pt-fluid-header-top koa:sm:mx-0 koa:sm:px-0 koa:grid koa:gap-3 koa:sm:gap-4 koa:max-w-prose koa:text-text-muted">
      <Markdown
        allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]}
        skipHtml
        components={{
          p: ({ children }) => <p className="koa:first:text-lg koa:first:font-medium koa:first:text-text-strong">{children}</p>,
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
