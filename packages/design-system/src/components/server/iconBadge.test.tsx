import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IconBadge } from "./iconBadge";

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

  it("should apply the solid variant", () => {
    render(
      <IconBadge variant="solid" color="secondary">
        Icon
      </IconBadge>,
    );
    expect(screen.getByText("Icon")).toHaveClass("ko:bg-secondary", "ko:text-on-bg-secondary");
    expect(screen.getByText("Icon")).not.toHaveClass("ko:bg-secondary/10");
  });

  it("should apply the small size", () => {
    render(<IconBadge size="small">Icon</IconBadge>);
    expect(screen.getByText("Icon")).toHaveClass("ko:size-6");
    expect(screen.getByText("Icon")).not.toHaveClass("ko:p-2");
  });
});
