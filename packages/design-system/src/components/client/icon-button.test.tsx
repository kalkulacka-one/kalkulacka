import { icons } from "@kalkulacka-one/design-system/icons";
import { twMerge } from "@kalkulacka-one/design-system/utilities";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IconButton, IconButtonVariants } from "./icon-button";

describe("IconButton", () => {
  it("should render a button named by its label", () => {
    render(<IconButton icon={icons.close} label="Close" />);
    expect(screen.getByRole("button", { name: "Close" })).toHaveAttribute("aria-label", "Close");
  });

  it("should render the icon as decorative", () => {
    render(<IconButton icon={icons.close} label="Close" />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("ko:size-5");
  });

  it("should render a larger icon for the large size", () => {
    render(<IconButton icon={icons.close} label="Close" size="large" />);
    expect(screen.getByRole("button").querySelector("svg")).toHaveClass("ko:size-6");
  });

  it("should have default style", () => {
    render(<IconButton icon={icons.close} label="Close" />);
    expect(screen.getByRole("button")).toHaveClass(twMerge(IconButtonVariants()));
  });

  describe("when given variant and size props", () => {
    it("should render the ghost variant at the touch-target size by default", () => {
      expect(IconButtonVariants().split(" ")).toEqual(
        expect.arrayContaining([
          "ko:rounded-pill",
          "ko:size-11",
          "ko:bg-transparent",
          "ko:data-hover:bg-neutral-wash",
          "ko:data-active:scale-[0.94]",
          "ko:data-disabled:opacity-45",
          "ko:data-focus:outline-3",
        ]),
      );
    });

    it("should render the surface variant as a plate", () => {
      const classes = IconButtonVariants({ variant: "surface", size: "large" }).split(" ");
      expect(classes).toEqual(
        expect.arrayContaining([
          "ko:size-12",
          "ko:bg-surface/72",
          "ko:shadow-[inset_0_0_0_1.5px_var(--ko-color-border)]",
          "ko:backdrop-blur-[12px]",
          "ko:backdrop-saturate-[1.4]",
          "ko:data-hover:bg-surface",
          "ko:data-hover:shadow-[inset_0_0_0_1.5px_var(--ko-color-border-strong),var(--ko-shadow-card-back)]",
        ]),
      );
      expect(classes).not.toContain("ko:size-11");
    });

    it("should render the correct class", () => {
      render(<IconButton icon={icons.close} label="Close" variant="surface" size="large" />);
      expect(screen.getByRole("button")).toHaveClass(twMerge(IconButtonVariants({ variant: "surface", size: "large" })));
    });
  });

  it("should forward onClick", () => {
    const onClick = vi.fn();
    render(<IconButton icon={icons.close} label="Close" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should forward a ref", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<IconButton icon={icons.close} label="Close" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  describe("when disabled", () => {
    it("should not be clickable", () => {
      const onClick = vi.fn();
      render(<IconButton icon={icons.close} label="Close" onClick={onClick} disabled />);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-disabled");
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
