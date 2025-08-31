import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from "../components";
import { GuidePage } from "./guide";

vi.mock("../components", () => ({
  Introduction: vi.fn(() => <div data-testid="mocked-introduction" />),
}));

const data = {
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator;

describe("GuidePage", () => {
  it("renders Introduction component when step is 1 and passes calculator prop", () => {
    render(<GuidePage calculator={data} step={1} />);

    expect(screen.getByTestId("mocked-introduction")).toBeInTheDocument();
    expect(Introduction).toHaveBeenCalledTimes(1);
    expect(Introduction).toHaveBeenCalledWith({ calculator: data }, undefined);
  });
});
