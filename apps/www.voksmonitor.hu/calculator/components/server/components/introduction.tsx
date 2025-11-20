import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="grid gap-2 max-w-prose text-slate-600">
      <p className="font-bold">
        A Voksmonitor célja, hogy a választók a politikával ne csak a pártok kommunikációján keresztül találkozzanak – hanem megismerjék a különböző politikai szereplők (esetünkben frakciók és
        képviselők) álláspontját a legfontosabb várospolitikai és szakmai kérdésekben. Az alkalmazás a válaszadóhoz rendeli azt a frakciót, illetve képviselőt, amelynek álláspontja a válaszok alapján
        legközelebb áll a kitöltő értékrendjéhez.
      </p>
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
      <p>
        A Voksmonitor a{" "}
        <a href="https://k-monitor.hu/" className="font-bold">
          K-Monitor
        </a>{" "}
        és a{" "}
        <a href="https://kohovolit.eu/" className="font-bold">
          KohoVolit.eu
        </a>{" "}
        közös projektje.
      </p>
    </div>
  );
}
