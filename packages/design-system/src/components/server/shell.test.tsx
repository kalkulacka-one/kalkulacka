import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Shell } from "./shell";

describe("Shell", () => {
  it("renders the header in the bar and the children in the content column", () => {
    const { container } = render(
      <Shell header={<span>Bar</span>}>
        <p>Body</p>
      </Shell>,
    );
    expect(container.firstElementChild).toHaveClass("ko-shell");
    expect(container.querySelector(".ko-shell-content > .ko-shell-bar")).toContainElement(screen.getByText("Bar"));
    expect(container.querySelector(".ko-shell-content")).toContainElement(screen.getByText("Body"));
    expect(container.querySelector(".ko-shell-bar")).not.toContainElement(screen.getByText("Body"));
  });

  it("mounts the backdrop layer first, hidden from assistive tech", () => {
    const { container } = render(<Shell header="Bar">Body</Shell>);
    const layer = container.querySelector(".ko-shell > :first-child");
    expect(layer).toHaveClass("ko-backdrop-layer");
    expect(layer).toHaveAttribute("aria-hidden", "true");
    expect(layer?.querySelector(".ko-backdrop")).not.toBeNull();
  });

  it("leaves the backdrop out when told to", () => {
    const { container } = render(
      <Shell header="Bar" backdrop={false}>
        Body
      </Shell>,
    );
    expect(container.querySelector(".ko-backdrop-layer")).toBeNull();
    expect(container.querySelector(".ko-backdrop")).toBeNull();
  });

  it("pins the document by default", () => {
    render(<Shell header="Bar">Body</Shell>);
    expect(document.documentElement.dataset.koScroll).toBe("pinned");
  });

  it("lets the document scroll when asked", () => {
    const { unmount } = render(
      <Shell header="Bar" scroll="document">
        Body
      </Shell>,
    );
    expect(document.documentElement.dataset.koScroll).toBe("document");

    unmount();
    expect(document.documentElement.hasAttribute("data-ko-scroll")).toBe(false);
  });
});
