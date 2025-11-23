import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ToggleButton } from "./toggleButton";

describe("Toggle button", () => {
  it("should render a switch", () => {
    render(<ToggleButton checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("should be off when checked is false", () => {
    render(<ToggleButton checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("should be on when checked is true", () => {
    render(<ToggleButton checked onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("should call onChange when clicked", () => {
    const handleChange = vi.fn();
    render(<ToggleButton checked={false} onChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
