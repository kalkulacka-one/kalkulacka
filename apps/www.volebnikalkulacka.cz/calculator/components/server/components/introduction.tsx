import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { title, intro } = calculator;
  return (
    <>
      <h1 className="ko:font-display font-semibold tracking-[-0.03em] text-2xl mb-3">{title}</h1>
      <Markdown allowedElements={["h1", "h2", "p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
        {intro}
      </Markdown>
    </>
  );
}
