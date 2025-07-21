import { Header } from "@repo/design-system/server";
import { getByText, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Header", () => {
  it("renders left content", () => {
    render(
      <Header>
        <Header.Left>Left</Header.Left>
      </Header>,
    );
    expect(screen.getByText("Left")).toBeInTheDocument();
  });
  it("renders right content", () => {
    render(
      <Header>
        <Header.Right>Right</Header.Right>
      </Header>,
    );
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});
