import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Screen } from "./screen";

describe("Screen", () => {
  it("renders the title as the page heading", () => {
    render(
      <Screen title="Rekapitulace" header="Bar">
        Body
      </Screen>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Rekapitulace");
    expect(heading).toHaveClass("ko-screen-title");
    expect(screen.getByRole("main")).toHaveClass("ko-screen");
  });

  it("lets the document scroll", () => {
    render(
      <Screen title="Rekapitulace" header="Bar">
        Body
      </Screen>,
    );
    expect(document.documentElement.dataset.koScroll).toBe("document");
  });

  it("renders the description under the title, and nothing when there is none", () => {
    const { rerender } = render(
      <Screen title="Rekapitulace" description="Vaše odpovědi" header="Bar">
        Body
      </Screen>,
    );
    const description = screen.getByText("Vaše odpovědi");
    expect(description.tagName).toBe("P");
    expect(description.previousElementSibling).toBe(screen.getByRole("heading", { level: 1 }));

    rerender(
      <Screen title="Rekapitulace" header="Bar">
        Body
      </Screen>,
    );
    expect(screen.queryByText("Vaše odpovědi")).toBeNull();
  });

  it("puts the back slot before the title", () => {
    render(
      <Screen title="Rekapitulace" back={<a href="/">Zpět</a>} header="Bar">
        Body
      </Screen>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.previousElementSibling).toBe(screen.getByRole("link", { name: "Zpět" }));
  });

  it("renders the header in the shell bar and the children in the main column", () => {
    const { container } = render(
      <Screen title="Rekapitulace" header={<span>Bar</span>}>
        <p>Body</p>
      </Screen>,
    );
    expect(container.querySelector(".ko-shell-bar")).toContainElement(screen.getByText("Bar"));
    expect(container.querySelector(".ko-screen-inner")).toContainElement(screen.getByText("Body"));
  });

  it("pins the footer to the bottom of the column", () => {
    render(
      <Screen title="Rekapitulace" header="Bar" footer={<button type="button">Pokračovat</button>}>
        Body
      </Screen>,
    );
    const footer = screen.getByRole("button", { name: "Pokračovat" }).parentElement;
    expect(footer).toHaveClass("ko:mt-auto", "ko:sticky", "ko:bottom-0");
    expect(footer?.parentElement).toHaveClass("ko-screen-inner");
    expect(footer?.nextElementSibling).toBeNull();
  });
});
