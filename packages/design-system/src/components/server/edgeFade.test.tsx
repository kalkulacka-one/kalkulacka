import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EdgeFade, EdgeFadeVariants } from "./edgeFade";

describe("EdgeFade", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<EdgeFade edge="top" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("covers the top edge with the page colour fading downwards", () => {
    const { container } = render(<EdgeFade edge="top" />);
    const fade = container.firstElementChild;
    expect(fade).toHaveClass(twMerge(EdgeFadeVariants({ edge: "top", size: "edge" })));
    expect(fade).toHaveClass("ko:top-0", "ko:bg-(image:--ko-fade-to-bottom)", "ko:h-fade-edge");
    expect(fade).not.toHaveClass("ko:bottom-0");
  });

  it("covers the bottom edge with the page colour fading upwards", () => {
    const { container } = render(<EdgeFade edge="bottom" />);
    expect(container.firstElementChild).toHaveClass("ko:bottom-0", "ko:bg-(image:--ko-fade-to-top)");
  });

  it("grows to the action band when asked", () => {
    const { container } = render(<EdgeFade edge="bottom" size="action" />);
    expect(container.firstElementChild).toHaveClass("ko:h-fade-action");
    expect(container.firstElementChild).not.toHaveClass("ko:h-fade-edge");
  });

  describe("visibility", () => {
    it("is always on when `visible` is omitted", () => {
      const { container } = render(<EdgeFade edge="top" />);
      expect(container.firstElementChild).toHaveAttribute("data-visible", "");
    });

    it("toggles with `visible`", () => {
      const { container, rerender } = render(<EdgeFade edge="top" visible={false} />);
      expect(container.firstElementChild).not.toHaveAttribute("data-visible");

      rerender(<EdgeFade edge="top" visible />);
      expect(container.firstElementChild).toHaveAttribute("data-visible", "");
    });
  });
});
