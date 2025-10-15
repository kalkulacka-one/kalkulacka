import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Header } from "./header";

describe("Header", () => {
  it("renders with basic content", () => {
    render(
      <Header>
        <Header.Main>
          <div>Main content</div>
        </Header.Main>
      </Header>,
    );

    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("applies correct classes for collapsed header", () => {
    const { container } = render(
      <Header expanded={false}>
        <Header.Main>
          <div>Main content</div>
        </Header.Main>
      </Header>,
    );

    const headerGrid = container.querySelector("div");
    expect(headerGrid).toHaveClass("ko:grid-rows-[3rem]");
    expect(headerGrid).not.toHaveClass("ko:grid-rows-[3rem_auto]");
  });

  it("applies correct classes for expanded header", () => {
    const { container } = render(
      <Header expanded={true}>
        <Header.Main>
          <div>Main content</div>
        </Header.Main>
      </Header>,
    );

    const headerGrid = container.querySelector("div");
    expect(headerGrid).toHaveClass("ko:grid-rows-[3rem_auto]");
    expect(headerGrid).not.toHaveClass("ko:grid-rows-[3rem]");
  });

  it("renders all sections when provided", () => {
    render(
      <Header expanded={true}>
        <Header.Main>
          <div>Main content</div>
        </Header.Main>
        <Header.Right>
          <div>Right content</div>
        </Header.Right>
        <Header.Bottom expanded={true}>
          <div>Bottom content</div>
        </Header.Bottom>
      </Header>,
    );

    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Right content")).toBeInTheDocument();
    expect(screen.getByText("Bottom content")).toBeInTheDocument();
  });

  describe("Header.Main", () => {
    it("spans 2 columns when expanded", () => {
      const { container } = render(
        <Header.Main expanded={true} hasBottomLeftContent={false}>
          <div>Main content</div>
        </Header.Main>,
      );

      const mainElement = container.firstElementChild;
      expect(mainElement).toHaveClass("ko:col-span-2");
    });

    it("spans 2 columns when no bottom left content", () => {
      const { container } = render(
        <Header.Main expanded={false} hasBottomLeftContent={false}>
          <div>Main content</div>
        </Header.Main>,
      );

      const mainElement = container.firstElementChild;
      expect(mainElement).toHaveClass("ko:col-span-2");
    });

    it("starts from column 2 when condensed with bottom left content", () => {
      const { container } = render(
        <Header.Main condensed={true} hasBottomLeftContent={true}>
          <div>Main content</div>
        </Header.Main>,
      );

      const mainElement = container.firstElementChild;
      expect(mainElement).toHaveClass("ko:col-start-2");
    });
  });

  describe("Header.Right", () => {
    it("renders children correctly", () => {
      render(
        <Header.Right>
          <button type="button">Action</button>
        </Header.Right>,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Action");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <Header.Right className="custom-class">
          <div>Content</div>
        </Header.Right>,
      );

      const rightElement = container.firstElementChild;
      expect(rightElement).toHaveClass("custom-class");
    });
  });

  describe("Header.Bottom", () => {
    it("renders when expanded", () => {
      render(
        <Header.Bottom expanded={true}>
          <div>Bottom content</div>
        </Header.Bottom>,
      );

      expect(screen.getByText("Bottom content")).toBeInTheDocument();
    });

    it("renders when condensed with bottom left content", () => {
      render(
        <Header.Bottom expanded={false} condensed={true} hasBottomLeftContent={true}>
          <div>Bottom content</div>
        </Header.Bottom>,
      );

      expect(screen.getByText("Bottom content")).toBeInTheDocument();
    });

    it("does not render when not expanded and no conditions met", () => {
      render(
        <Header.Bottom expanded={false} condensed={false} hasBottomLeftContent={false}>
          <div>Bottom content</div>
        </Header.Bottom>,
      );

      expect(screen.queryByText("Bottom content")).not.toBeInTheDocument();
    });

    it("applies expanded classes when expanded", () => {
      const { container } = render(
        <Header.Bottom expanded={true}>
          <div>Bottom content</div>
        </Header.Bottom>,
      );

      const bottomElement = container.firstElementChild;
      expect(bottomElement).toHaveClass("ko:col-span-3");
      expect(bottomElement).toHaveClass("ko:flex");
    });

    it("applies condensed classes when not expanded", () => {
      const { container } = render(
        <Header.Bottom expanded={false} condensed={true} hasBottomLeftContent={true}>
          <div>Bottom content</div>
        </Header.Bottom>,
      );

      const bottomElement = container.firstElementChild;
      expect(bottomElement).toHaveClass("ko:row-start-1");
      expect(bottomElement).not.toHaveClass("ko:col-span-3");
    });
  });

  describe("Header.BottomLeft", () => {
    it("renders normally when not condensed", () => {
      const { container } = render(
        <Header.BottomLeft condensed={false}>
          <div>Bottom left content</div>
        </Header.BottomLeft>,
      );

      expect(screen.getByText("Bottom left content")).toBeInTheDocument();
      const element = container.firstElementChild;
      expect(element).not.toHaveClass("ko:row-start-1");
    });

    it("applies condensed layout when condensed", () => {
      const { container } = render(
        <Header.BottomLeft condensed={true}>
          <div>Bottom left content</div>
        </Header.BottomLeft>,
      );

      expect(screen.getByText("Bottom left content")).toBeInTheDocument();
      const element = container.firstElementChild;
      expect(element).toHaveClass("ko:row-start-1");
      expect(element).toHaveClass("ko:col-start-1");
      expect(element).toHaveClass("ko:grid");
    });
  });

  describe("Header.BottomMain", () => {
    it("renders when not condensed", () => {
      render(
        <Header.BottomMain condensed={false}>
          <div>Bottom main content</div>
        </Header.BottomMain>,
      );

      expect(screen.getByText("Bottom main content")).toBeInTheDocument();
    });

    it("does not render when condensed", () => {
      render(
        <Header.BottomMain condensed={true}>
          <div>Bottom main content</div>
        </Header.BottomMain>,
      );

      expect(screen.queryByText("Bottom main content")).not.toBeInTheDocument();
    });
  });

  describe("compound component structure", () => {
    it("has correct compound component properties", () => {
      expect(Header.Main).toBeDefined();
      expect(Header.Right).toBeDefined();
      expect(Header.Bottom).toBeDefined();
      expect(Header.BottomLeft).toBeDefined();
      expect(Header.BottomMain).toBeDefined();
    });
  });
});
