import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExpandableCard } from "@/src/components/client/expandableCard";

describe("ExpandableCard", () => {
  it("renders content without expanded content", () => {
    render(
      <ExpandableCard>
        <ExpandableCard.Content>
          <div>Always visible content</div>
        </ExpandableCard.Content>
      </ExpandableCard>,
    );

    expect(screen.getByText("Always visible content")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with both content and expanded content", () => {
    render(
      <ExpandableCard>
        <ExpandableCard.Content>
          <div>Always visible content</div>
        </ExpandableCard.Content>
        <ExpandableCard.HiddenContent>
          <div>Hidden content</div>
        </ExpandableCard.HiddenContent>
      </ExpandableCard>,
    );

    expect(screen.getByText("Always visible content")).toBeInTheDocument();
    // Hidden content should not be visible initially
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("expands when clicked", () => {
    render(
      <ExpandableCard>
        <ExpandableCard.Content>
          <div>Always visible content</div>
        </ExpandableCard.Content>
        <ExpandableCard.HiddenContent>
          <div>Hidden content</div>
        </ExpandableCard.HiddenContent>
      </ExpandableCard>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("starts expanded when defaultOpen prop is true", () => {
    render(
      <ExpandableCard defaultOpen={true}>
        <ExpandableCard.Content>
          <div>Always visible content</div>
        </ExpandableCard.Content>
        <ExpandableCard.HiddenContent>
          <div>Hidden content</div>
        </ExpandableCard.HiddenContent>
      </ExpandableCard>,
    );

    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("passes card props correctly", () => {
    const { container } = render(
      <ExpandableCard corner="topRight" shadow="hard">
        <ExpandableCard.Content>
          <div>Content</div>
        </ExpandableCard.Content>
        <ExpandableCard.HiddenContent>
          <div>Expanded</div>
        </ExpandableCard.HiddenContent>
      </ExpandableCard>,
    );

    // Find the actual Card component (the Disclosure component)
    const card = container.firstElementChild;
    expect(card).toHaveClass("ko:rounded-tr-none");
    expect(card).toHaveClass("ko:drop-shadow-hard");
  });
});
