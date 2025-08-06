import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Layout from "./layout";

describe("RootLayout", () => {
  it("should render the main heading", async () => {
    const mockParams = Promise.resolve({ lang: "cs" });
    render(await Layout({ params: mockParams, children: null }));
    expect(screen.getByText("Volební kalkulačka"));
  });
});
