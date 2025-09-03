import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../components/client", () => ({
  ThemeProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

import Layout from "./layout";

describe("RootLayout", () => {
  it("should render children within ThemeProvider", async () => {
    render(await Layout({ children: <div>Test content</div> }));
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
