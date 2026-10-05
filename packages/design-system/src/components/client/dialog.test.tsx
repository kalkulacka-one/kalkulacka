import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("should render nothing while closed", () => {
    render(<Dialog open={false} onClose={() => {}} title="Title" closeLabel="Close" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render a dialog named by its title when open", () => {
    render(
      <Dialog open onClose={() => {}} title="Title" closeLabel="Close">
        Body
      </Dialog>,
    );
    expect(screen.getByRole("dialog", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("should render the eyebrow", () => {
    render(<Dialog open onClose={() => {}} title="Title" eyebrow={<span>Chip</span>} closeLabel="Close" />);
    expect(screen.getByText("Chip")).toBeInTheDocument();
  });

  it("should call onClose from the close button", () => {
    const handleClose = vi.fn();
    render(<Dialog open onClose={handleClose} title="Title" closeLabel="Close" />);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose on Escape", () => {
    const handleClose = vi.fn();
    render(<Dialog open onClose={handleClose} title="Title" closeLabel="Close" />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
