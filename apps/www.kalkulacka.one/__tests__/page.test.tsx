import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Layout from "../app/[lang]/layout";

describe("RootLayout", () => {
  it("should render the main heading", async () => {
    const mockParams = Promise.resolve({ lang: "cs" });

    render(await Layout({ params: mockParams, children: null }));

    const heading = screen.getByRole("heading", {
      name: /Kalkulacka.1/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
