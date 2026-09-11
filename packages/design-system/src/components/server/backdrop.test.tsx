import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Backdrop } from "./backdrop";

describe("Backdrop", () => {
  it("renders the gradient hook and nothing else", () => {
    const { container } = render(<Backdrop />);
    const backdrop = container.firstElementChild;
    expect(backdrop).toHaveClass("ko-backdrop");
    expect(backdrop).toBeEmptyDOMElement();
  });

  it("is hidden from assistive tech", () => {
    const { container } = render(<Backdrop />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
