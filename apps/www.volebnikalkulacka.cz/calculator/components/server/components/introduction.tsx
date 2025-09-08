import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { title, intro } = calculator;
  return (
    <>
      <h1>{title}</h1>
      <Markdown allowedElements={["p", "strong", "em", "ul", "ol", "li", "a"]} skipHtml>
        {intro}
      </Markdown>
    </>
  );
}
