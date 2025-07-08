import { Input } from "@repo/design-system/client";
import { EnvelopeIcon } from "@repo/design-system/icons";
import { twMerge } from "@repo/design-system/utils";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Input", () => {
  it("should render", () => {
    render(<Input placeholder="Input placeholder" data-testid="input" />);
    expect(screen.getByPlaceholderText("Input placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should render with an icon and proper styling", () => {
    render(
      <Input placeholder="Input placeholder" data-testid="input">
        <EnvelopeIcon data-testid="icon" />
      </Input>,
    );
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toHaveClass(twMerge("ko:pl-14 ko:p-4"));
  });
});
