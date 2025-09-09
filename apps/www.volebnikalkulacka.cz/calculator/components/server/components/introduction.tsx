import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { title, intro } = calculator;
  return (
    <div className="grid gap-6 max-w-prose">
      <h1 className="ko:font-display text-2xl font-bold">{title}</h1>
      <div className="grid gap-1">
        <Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
          {intro}
        </Markdown>
      </div>
    </div>
  );
}
