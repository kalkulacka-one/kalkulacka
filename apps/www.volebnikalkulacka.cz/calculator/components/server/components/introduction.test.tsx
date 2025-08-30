import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { Introduction } from ".";

const data = {
  id: "00000000-0000-0000-0000-000000000000",
  createdAt: new Date(0).toISOString(),
  key: "kalkulacka",
  shortTitle: "Sněmovní 2025",
  title: "Volební kalkulačka pro sněmovní volby 2025",
  intro: "Čeká vás 35 otázek, na které jsme se zeptali všech 26 kandidujících subjektů.",
} satisfies Calculator;

describe("Introduction", () => {
  it("renders title and intro", () => {
    render(<Introduction calculator={data} />);
    expect(screen.getByText(data.title)).toBeInTheDocument();
    expect(screen.getByText(data.intro)).toBeInTheDocument();
  });
});
