import { IconBadge } from "@kalkulacka-one/design-system/server";

import { screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("IconBadge", () => {
  it("should render children", () => {
    render(<IconBadge>🚀</IconBadge>);
    expect(screen.getByText("🚀")).toBeInTheDocument();
  });

  it("should have default primary color style", () => {
    render(<IconBadge>Icon</IconBadge>);
    expect(screen.getByText("Icon")).toHaveClass("ko:text-primary", "ko:bg-primary/10", "ko:rounded-full", "ko:p-2", "ko:w-fit");
  });

  it("should apply secondary color variant", () => {
    render(<IconBadge color="secondary">Icon</IconBadge>);
    expect(screen.getByText("Icon")).toHaveClass("ko:text-secondary", "ko:bg-secondary/10");
  });

  it("should apply neutral color variant", () => {
    render(<IconBadge color="neutral">Icon</IconBadge>);
    expect(screen.getByText("Icon")).toHaveClass("ko:text-neutral", "ko:bg-neutral/10");
  });
});
