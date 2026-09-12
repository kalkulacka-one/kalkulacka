import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type ElectionCard, ElectionCards } from "./ElectionCards";

const elections: ElectionCard[] = [
  {
    key: "komunalni-2026",
    name: "Komunální volby 2026",
    scope: "73 měst",
    heading: "Jak volit ve vašem městě?",
    description: "Vyberte své město.",
    callToAction: "Vybrat město",
    href: "/volby/komunalni-2026",
  },
  {
    key: "senatni-2026",
    name: "Senátní volby 2026",
    scope: "27 obvodů",
    heading: "Koho poslat do Senátu?",
    description: "Vyberte svůj obvod.",
    callToAction: "Vybrat obvod",
    href: "/volby/senatni-2026",
  },
];

describe("ElectionCards", () => {
  it("links each election to its own selection page", () => {
    render(<ElectionCards elections={elections} />);

    expect(screen.getByRole("link", { name: "Vybrat město" })).toHaveAttribute("href", "/volby/komunalni-2026");
    expect(screen.getByRole("link", { name: "Vybrat obvod" })).toHaveAttribute("href", "/volby/senatni-2026");
  });

  it("shows the name and the scope of each election", () => {
    render(<ElectionCards elections={elections} />);

    expect(screen.getByText("Komunální volby 2026")).toBeInTheDocument();
    expect(screen.getByText("73 měst")).toBeInTheDocument();
    expect(screen.getByText("27 obvodů")).toBeInTheDocument();
  });

  it("renders nothing but the empty grid when there are no elections", () => {
    render(<ElectionCards elections={[]} />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
