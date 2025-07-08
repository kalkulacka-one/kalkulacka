import { Input } from "@repo/design-system/client";
import { EnvelopeIcon } from "@repo/design-system/icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Input", () => {
  it("should render", () => {
    render(<Input placeholder="Input placeholder" data-testid="input" />);
    expect(screen.getByPlaceholderText("Input placeholder")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
  });

  it("should render with an icon", () => {
    render(
      <Input placeholder="Input placeholder" data-testid="input">
        <div>Some</div>
      </Input>,
    );
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
