import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmbedLayout } from "./embed-layout";

function parts(container: HTMLElement) {
  const root = container.firstElementChild as HTMLElement;
  const region = screen.getByRole("main").parentElement as HTMLElement;
  return { children: [...root.children].map((child) => child.textContent), region: region.textContent };
}

describe("EmbedLayout", () => {
  it("keeps the header and the footer outside the scrolling region", () => {
    const { container } = render(
      <EmbedLayout>
        <EmbedLayout.Header>header</EmbedLayout.Header>
        <EmbedLayout.Content>content</EmbedLayout.Content>
        <EmbedLayout.BottomNavigation>navigation</EmbedLayout.BottomNavigation>
        <EmbedLayout.Footer>footer</EmbedLayout.Footer>
      </EmbedLayout>,
    );

    expect(parts(container)).toEqual({ children: ["header", "contentnavigation", "footer"], region: "contentnavigation" });
  });

  it("puts a header that is not a direct child into the scrolling region", () => {
    const { container } = render(
      <EmbedLayout>
        <section>
          <EmbedLayout.Header>header</EmbedLayout.Header>
          <EmbedLayout.Content>content</EmbedLayout.Content>
        </section>
      </EmbedLayout>,
    );

    expect(parts(container)).toEqual({ children: ["headercontent"], region: "headercontent" });
  });

  it("skips falsy children", () => {
    const { container } = render(
      <EmbedLayout>
        <EmbedLayout.Header>header</EmbedLayout.Header>
        {false}
        <EmbedLayout.Content>content</EmbedLayout.Content>
        {null}
      </EmbedLayout>,
    );

    expect(parts(container)).toEqual({ children: ["header", "content"], region: "content" });
  });
});
