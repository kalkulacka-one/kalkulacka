import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../components/client", () => ({
  ThemeProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

import Layout from "./layout";

describe("RootLayout", () => {
  it("should render the main heading", async () => {
    render(await Layout({ children: null }));
    expect(screen.getByText("Volební kalkulačka"));
  });
});
