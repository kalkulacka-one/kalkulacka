import { Icon } from "@kalkulacka-one/design-system/client";
import { EnvelopeIcon } from "@kalkulacka-one/design-system/icons";

import { mdiAccount } from "@mdi/js";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Icon", () => {
  it("should render when given a path string", () => {
    render(<Icon icon={mdiAccount} decorative data-testid="account" />);
    expect(screen.getByTestId("account")).toBeInTheDocument();
  });
  it("should render when given an SVG component", () => {
    render(<Icon icon={EnvelopeIcon} decorative data-testid="envelope" />);
    expect(screen.getByTestId("envelope")).toBeInTheDocument();
  });
  describe("when set as decorative", () => {
    it("should not be visible to screen readers", () => {
      const { container } = render(<Icon icon={mdiAccount} decorative data-testid="account" />);
      expect(screen.queryByRole("img")).toBe(null);
      expect(container.querySelector("title")).toBe(null);
      expect(screen.getByTestId("account")).toHaveAttribute("aria-hidden", "true");
    });
  });
  describe("when set as non-decorative", () => {
    it("should be visible to screen readers", () => {
      render(<Icon icon={EnvelopeIcon} decorative={false} title="envelope" />);
      expect(screen.getByRole("img", { name: "envelope" })).toBeVisible();
      expect(screen.getByTitle("envelope")).toBeInTheDocument();
    });
  });
  describe("when given size prop", () => {
    it("should render the correct class", () => {
      const { container } = render(<Icon icon={EnvelopeIcon} decorative size="small" data-testid="envelope" />);
      expect(container.firstChild).toHaveClass("ko:size-4 ko:min-w-4");
    });
  });
});
