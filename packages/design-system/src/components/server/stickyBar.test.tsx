import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StickyBar, StickyBarVariants } from "./stickyBar";

describe("StickyBar", () => {
  it("renders its children", () => {
    render(
      <StickyBar>
        <button type="button">Pokračovat</button>
      </StickyBar>,
    );
    expect(screen.getByRole("button", { name: "Pokračovat" })).toBeInTheDocument();
  });

  it("floats by default", () => {
    const { container } = render(<StickyBar>Akce</StickyBar>);
    const bar = container.firstElementChild;
    expect(bar).toHaveClass(twMerge(StickyBarVariants({ variant: "floating" })));
    expect(bar).toHaveClass("ko-sticky-bar-floating", "ko:[&>*]:shadow-card-back", "ko:sticky", "ko:bottom-0");
  });

  it("stacks on a phone and goes side by side from xs up, with the last child leading when stacked", () => {
    const { container } = render(<StickyBar>Akce</StickyBar>);
    expect(container.firstElementChild).toHaveClass("ko:flex-col", "ko:xs:flex-row", "ko:[&>:last-child]:order-first", "ko:xs:[&>:last-child]:order-none");
  });

  describe("when flat", () => {
    it("drops the scrim and the children's shadows", () => {
      const { container } = render(<StickyBar variant="flat">Akce</StickyBar>);
      const bar = container.firstElementChild;
      expect(bar).toHaveClass(twMerge(StickyBarVariants({ variant: "flat" })));
      expect(bar).toHaveClass("ko:[&>*]:shadow-none");
      expect(bar).not.toHaveClass("ko-sticky-bar-floating");
      expect(bar).not.toHaveClass("ko:[&>*]:shadow-card-back");
    });
  });
});
