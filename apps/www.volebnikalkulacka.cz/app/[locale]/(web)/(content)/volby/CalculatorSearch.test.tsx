import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CalculatorSearch, type SearchableCalculator } from "./CalculatorSearch";

const cities: SearchableCalculator[] = [
  { key: "beroun", districtName: "Beroun", variants: [] },
  { key: "zdar-nad-sazavou", districtName: "Žďár nad Sázavou", variants: [] },
  { key: "praha", districtName: "Praha", variants: [{ key: "praha-inventura", name: "Inventura hlasování" }] },
];

function renderSearch(calculators: SearchableCalculator[] = cities, props: Partial<React.ComponentProps<typeof CalculatorSearch>> = {}) {
  const placeholder = props.placeholder ?? "Hledat město…";
  render(<CalculatorSearch calculators={calculators} basePath="/volby/komunalni-2026" label="Zvolte své město" {...props} placeholder={placeholder} />);
  return screen.getByPlaceholderText(placeholder);
}

describe("CalculatorSearch", () => {
  it("lists every calculator before anything is typed", () => {
    renderSearch();

    expect(screen.getByRole("link", { name: "Beroun" })).toHaveAttribute("href", "/volby/komunalni-2026/beroun");
    expect(screen.getByRole("link", { name: "Žďár nad Sázavou" })).toBeInTheDocument();
    expect(screen.getByText("Celkem 3")).toBeInTheDocument();
  });

  it("narrows the list to what was typed", () => {
    const input = renderSearch();

    fireEvent.change(input, { target: { value: "ber" } });

    expect(screen.getByRole("link", { name: "Beroun" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Praha" })).not.toBeInTheDocument();
    expect(screen.getByText("Nalezeno 1 z 3")).toBeInTheDocument();
  });

  it("matches a name whose diacritics were left off", () => {
    const input = renderSearch();

    fireEvent.change(input, { target: { value: "zdar" } });

    expect(screen.getByRole("link", { name: "Žďár nad Sázavou" })).toBeInTheDocument();
  });

  it("offers a city's other calculators alongside it", () => {
    renderSearch();

    expect(screen.getByRole("link", { name: "Inventura hlasování" })).toHaveAttribute("href", "/volby/komunalni-2026/praha-inventura");
  });

  it("points at the sign-up page when nothing matches", () => {
    const input = renderSearch();

    fireEvent.change(input, { target: { value: "lhota" } });

    expect(screen.getByText(/nic nenašli/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pomozte nám/ })).toHaveAttribute("href", "/zapojte-se");
  });

  it("matches a constituency by its code, and shows the code where the data asks for it", () => {
    const districts: SearchableCalculator[] = [
      { key: "3-cheb", districtName: "Cheb", districtCode: "3" },
      { key: "6-louny", districtName: "Louny", districtCode: "6" },
    ];
    const input = renderSearch(districts, { showCode: true, placeholder: "Hledat obvod…" });

    expect(screen.getByRole("link", { name: "3. Cheb" })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "6" } });

    expect(screen.getByRole("link", { name: "6. Louny" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "3. Cheb" })).not.toBeInTheDocument();
  });
});
