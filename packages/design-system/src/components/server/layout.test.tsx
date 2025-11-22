import { Layout } from "@kalkulacka-one/design-system/server";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Layout", () => {
  it("should render children", () => {
    render(<Layout>Children</Layout>);
    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("should have grid layout classes", () => {
    const { container } = render(<Layout>Content</Layout>);
    expect(container.firstChild).toHaveClass("ko:min-h-screen", "ko:grid", "ko:grid-rows-[auto_1fr_auto]");
  });

  describe("Layout.Header", () => {
    it("should render children", () => {
      render(<Layout.Header>Header Content</Layout.Header>);
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("should have default sticky positioning", () => {
      const { container } = render(<Layout.Header>Header</Layout.Header>);
      expect(container.firstChild).toHaveClass("ko:top-0", "ko:z-50", "ko:sticky");
    });

    it("should have fixed positioning when fixed prop is true", () => {
      const { container } = render(<Layout.Header fixed={true}>Header</Layout.Header>);
      expect(container.firstChild).toHaveClass("ko:fixed", "ko:left-0", "ko:w-full");
    });
  });

  describe("Layout.Content", () => {
    it("should render children in main element", () => {
      render(<Layout.Content>Main Content</Layout.Content>);
      expect(screen.getByRole("main")).toHaveTextContent("Main Content");
    });

    it("should have default responsive width classes", () => {
      render(<Layout.Content>Content</Layout.Content>);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("ko:mx-auto", "ko:p-2", "ko:sm:p-4", "ko:max-w-xl", "ko:w-full");
    });

    it("should have full width when fullWidth prop is true", () => {
      render(<Layout.Content fullWidth={true}>Content</Layout.Content>);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("ko:w-full");
      expect(main).not.toHaveClass("ko:max-w-xl");
    });
  });

  describe("Layout.BottomNavigation", () => {
    it("should render children", () => {
      render(<Layout.BottomNavigation>Bottom Nav</Layout.BottomNavigation>);
      expect(screen.getByText("Bottom Nav")).toBeInTheDocument();
    });

    it("should have fixed bottom positioning", () => {
      const { container } = render(<Layout.BottomNavigation>Nav</Layout.BottomNavigation>);
      expect(container.firstChild).toHaveClass("ko:fixed", "ko:bottom-0", "ko:left-0", "ko:right-0", "ko:pointer-events-none", "ko:z-20");
    });

    it("should merge custom className", () => {
      const { container } = render(<Layout.BottomNavigation className="custom-class">Nav</Layout.BottomNavigation>);
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Layout.Footer", () => {
    it("should render children in footer element", () => {
      render(<Layout.Footer>Footer Content</Layout.Footer>);
      expect(screen.getByRole("contentinfo")).toHaveTextContent("Footer Content");
    });

    it("should have fixed bottom positioning", () => {
      render(<Layout.Footer>Footer</Layout.Footer>);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveClass("ko:grid", "ko:justify-items-center", "ko:fixed", "ko:bottom-0", "ko:left-0", "ko:right-0", "ko:z-5");
    });

    it("should return null when no children", () => {
      const { container } = render(<Layout.Footer>{null}</Layout.Footer>);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("Layout.BottomSpacer", () => {
    it("should render with aria-hidden", () => {
      const { container } = render(<Layout.BottomSpacer />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });

    it("should apply custom className", () => {
      const { container } = render(<Layout.BottomSpacer className="custom-spacer" />);
      expect(container.firstChild).toHaveClass("custom-spacer");
    });
  });
});
