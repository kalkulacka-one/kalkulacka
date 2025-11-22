import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { calculatorViewModel } from "@/calculator/view-models/server";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from ".";

const data = calculatorViewModel({
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator);

const dataWithMarkdown = calculatorViewModel({
  ...data,
  intro: [
    "Čeká vás **35 otázek**, na které jsme se zeptali *všech 26* kandidujících subjektů.",
    ["Seznam úkolů:", "- První úkol", "- Druhý úkol", "- Třetí úkol"].join("\n"),
    ["Postup:", "1. První krok", "2. Druhý krok", "3. Třetí krok"].join("\n"),
    "Více informací najdete na [kalkulacka.one](https://www.kalkulacka.one).",
  ].join("\n\n"),
});

describe("Introduction", () => {
  it("renders intro content", () => {
    render(<Introduction calculator={data} />);
    if (data.intro) {
      expect(screen.getByText(data.intro)).toBeInTheDocument();
    }
  });

  describe("Markdown formatting", () => {
    it("renders bold text", () => {
      render(<Introduction calculator={dataWithMarkdown} />);

      const strongElement = screen.getByText("35 otázek");
      expect(strongElement.tagName).toBe("STRONG");
    });

    it("renders italic text", () => {
      render(<Introduction calculator={dataWithMarkdown} />);

      const emElement = screen.getByText("všech 26");
      expect(emElement.tagName).toBe("EM");
    });

    it("renders unordered lists", () => {
      const { container } = render(<Introduction calculator={dataWithMarkdown} />);

      const ulElement = container.querySelector("ul");
      expect(ulElement).toBeInTheDocument();

      const ulItems = ulElement?.querySelectorAll("li");
      expect(ulItems).toHaveLength(3);
      expect(ulItems?.[0]?.textContent).toBe("První úkol");
      expect(ulItems?.[1]?.textContent).toBe("Druhý úkol");
      expect(ulItems?.[2]?.textContent).toBe("Třetí úkol");
    });

    it("renders ordered lists", () => {
      const { container } = render(<Introduction calculator={dataWithMarkdown} />);

      const olElement = container.querySelector("ol");
      expect(olElement).toBeInTheDocument();

      const olItems = olElement?.querySelectorAll("li");
      expect(olItems).toHaveLength(3);
      expect(olItems?.[0]?.textContent).toBe("První krok");
      expect(olItems?.[1]?.textContent).toBe("Druhý krok");
      expect(olItems?.[2]?.textContent).toBe("Třetí krok");
    });

    it("renders links", () => {
      render(<Introduction calculator={dataWithMarkdown} />);

      const kalkulackaLink = screen.getByText("kalkulacka.one");
      expect(kalkulackaLink.tagName).toBe("A");
      expect(kalkulackaLink).toHaveAttribute("href", "https://www.kalkulacka.one");
    });

    it("strips disallowed elements like heading", () => {
      const { container } = render(
        <Introduction
          calculator={{
            ...data,
            intro: ["# This heading should be stripped", "This paragraph should remain."].join("\n\n"),
          }}
        />,
      );

      const h1Elements = container.querySelectorAll("h1");
      expect(h1Elements).toHaveLength(0);
      expect(screen.getByText("This paragraph should remain.")).toBeInTheDocument();
      expect(screen.queryByText("This heading should be stripped")).not.toBeInTheDocument();
    });
  });
});
