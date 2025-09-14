import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="grid gap-2 max-w-prose text-slate-600">
      <Markdown
        allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]}
        skipHtml
        components={{
          a: ({ href, children }) => (
            <a href={href} className="text-[var(--ko-color-primary)] hover:text-[var(--ko-color-primary-hover)] underline hover:no-underline" target="_blank" rel="noopener noreferrer">
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
