import { EnvelopeIcon } from "@kalkulacka-one/design-system/icons";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./input";

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
    expect(screen.getByTestId("input")).toHaveClass("ko:px-4", "ko:pl-14");
  });

  it("shows a clear button only while there is a value, and clearing refocuses the input", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const { rerender } = render(<Input value="" onChange={() => {}} onClear={onClear} clearLabel="Vymazat" />);
    expect(screen.queryByRole("button", { name: "Vymazat" })).not.toBeInTheDocument();

    rerender(<Input value="Brno" onChange={() => {}} onClear={onClear} clearLabel="Vymazat" />);
    await user.click(screen.getByRole("button", { name: "Vymazat" }));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
