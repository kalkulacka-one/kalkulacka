import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VisuallyHidden } from "./visuallyHidden";

describe("VisuallyHidden", () => {
  it("should render a screen-reader-only span", () => {
    render(<VisuallyHidden>Ano</VisuallyHidden>);
    const element = screen.getByText("Ano");
    expect(element.tagName).toBe("SPAN");
    expect(element).toHaveClass("ko:sr-only");
  });

  describe("when given another element and aria-live", () => {
    it("should render as that element with the live region attribute", () => {
      render(
        <VisuallyHidden as="output" aria-live="polite">
          Odpověď zaznamenána: Ano
        </VisuallyHidden>,
      );
      const element = screen.getByText("Odpověď zaznamenána: Ano");
      expect(element.tagName).toBe("OUTPUT");
      expect(element).toHaveAttribute("aria-live", "polite");
      expect(element).toHaveClass("ko:sr-only");
    });
  });

  it("should pass other HTML attributes through", () => {
    render(<VisuallyHidden id="answer-status">Ano</VisuallyHidden>);
    expect(screen.getByText("Ano")).toHaveAttribute("id", "answer-status");
  });
});
