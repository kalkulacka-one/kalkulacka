import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="grid gap-1 max-w-prose">
      <Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
        {intro}
      </Markdown>
    </div>
  );
}
