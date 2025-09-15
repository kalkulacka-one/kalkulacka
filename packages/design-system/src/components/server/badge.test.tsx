import { Badge } from "@repo/design-system/server";
import { twMerge } from "@repo/design-system/utils";
import { render, screen } from "@testing-library/react";
import { cva } from "class-variance-authority";
import { describe, expect, it } from "vitest";

const BadgeVariants = cva("ko:px-1.5 ko:border ko:w-fit ko:rounded-sm ko:text-xs", {
  variants: {
    icon: {
      true: "ko:flex ko:gap-1.5 ko:items-center ko:[&>svg]:opacity-70",
      false: "",
    },
    color: {
      primary: "ko:bg-primary/8 ko:text-primary ko:border-transparent",
      secondary: "ko:bg-secondary/8 ko:text-secondary ko:border-transparent",
      yellow: "ko:bg-yellow/8 ko:text-yellow ko:border-transparent",
      green: "ko:bg-green/8 ko:text-green ko:border-transparent",
      neutral: "ko:bg-neutral/8 ko:text-neutral ko:border-transparent",
      transparent: "ko:border ko:text-neutral ko:border-neutral/10",
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

describe("Badge", () => {
  it("should render children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should have default style when no variant specified", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants()));
  });

  describe("when given a specific color prop", () => {
    it("should render the correct class for secondary color", () => {
      render(<Badge color="secondary">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "secondary" })));
    });

    it("should render the correct class for yellow color", () => {
      render(<Badge color="yellow">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "yellow" })));
    });

    it("should render the correct class for green color", () => {
      render(<Badge color="green">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "green" })));
    });

    it("should render the correct class for neutral color", () => {
      render(<Badge color="neutral">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "neutral" })));
    });

    it("should render the correct class for transparent color", () => {
      render(<Badge color="transparent">Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "transparent" })));
    });
  });

  describe("when given an icon prop", () => {
    it("should render the correct class when icon is true", () => {
      render(<Badge icon={true}>Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ icon: true })));
    });

    it("should render the correct class when icon is false", () => {
      render(<Badge icon={false}>Badge</Badge>);
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ icon: false })));
    });
  });

  describe("when given both color and icon props", () => {
    it("should render the correct class", () => {
      render(
        <Badge color="yellow" icon={true}>
          Badge
        </Badge>,
      );
      expect(screen.getByText("Badge")).toHaveClass(twMerge(BadgeVariants({ color: "yellow", icon: true })));
    });
  });
});
