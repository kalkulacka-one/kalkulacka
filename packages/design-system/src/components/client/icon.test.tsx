import { mdiAccount } from "@mdi/js";
import { Icon } from "@repo/design-system/client";
import { EnvelopeIcon } from "@repo/design-system/icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Path icon", () => {
  it("renders non-accessible decorative path icon", () => {
    const { container } = render(<Icon icon={mdiAccount} decorative data-testid="account" />);
    expect(container.firstChild).toHaveClass("ko:size-6 ko:min-w-6");
    expect(screen.queryByRole("img")).toBe(null);
    expect(container.querySelector("title")).toBe(null);
    expect(screen.getByTestId("account")).toHaveAttribute("aria-hidden", "true");
  });
  it("renders an accessible non-decorative path icon", () => {
    const { container } = render(<Icon icon={mdiAccount} decorative={false} title="account" />);
    expect(container.firstChild).toHaveClass("ko:size-6 ko:min-w-6");
    expect(screen.getByRole("img", { name: "account" })).toBeVisible();
    expect(screen.getByTitle("account")).toBeInTheDocument();
  });
});

describe("Svg icon", () => {
  it("renders non-accessible decorative svg icon", () => {
    const { container } = render(<Icon icon={EnvelopeIcon} decorative data-testid="envelope" />);
    expect(container.firstChild).toHaveClass("ko:size-6 ko:min-w-6");
    expect(screen.queryByRole("img")).toBe(null);
    expect(container.querySelector("title")).toBe(null);
    expect(screen.getByTestId("envelope")).toHaveAttribute("aria-hidden", "true");
  });
  it("renders an accessible non-decorative svg icon", () => {
    const { container } = render(<Icon icon={EnvelopeIcon} decorative={false} title="envelope" />);
    expect(container.firstChild).toHaveClass("ko:size-6 ko:min-w-6");
    expect(screen.getByRole("img", { name: "envelope" })).toBeVisible();
    expect(screen.getByTitle("envelope")).toBeInTheDocument();
  });
});
