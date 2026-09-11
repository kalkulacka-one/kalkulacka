// Ported from kalkulacka-2026/packages/ui/src/filter-chips/filter-chips.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilterChips, type FilterOption } from "./filterChips";

const options: FilterOption[] = [
  { id: "all", label: "Vše", count: 42 },
  { id: "agree", label: "Shody", count: 12 },
  { id: "important", label: "Důležité", count: 7, separatorBefore: true },
  { id: "unanswered", label: "Nezodpovězené" },
];

describe("FilterChips", () => {
  it("marks exactly the active option as pressed", () => {
    render(<FilterChips label="Filtr" options={options} value="agree" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /Vše/ })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /Shody/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /Důležité/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the clicked option id", () => {
    const onChange = vi.fn();
    render(<FilterChips label="Filtr" options={options} value="all" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Důležité/ }));
    expect(onChange).toHaveBeenCalledWith("important");
  });

  it("names the group for assistive tech via a visually hidden legend", () => {
    render(<FilterChips label="Filtrovat otázky" options={options} value="all" onChange={() => {}} />);
    const group = screen.getByRole("group", { name: "Filtrovat otázky" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group.querySelector("legend")).toHaveClass("ko:sr-only");
  });

  it("shows the count next to each label when provided", () => {
    render(<FilterChips label="Filtr" options={options} value="all" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /Vše.*42/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nezodpovězené" }).querySelector(".ko\\:tabular-nums")).toBeNull();
  });

  it("draws a hairline before an option that asks for one, hidden from assistive tech", () => {
    render(<FilterChips label="Filtr" options={options} value="all" onChange={() => {}} />);
    const divider = screen.getByRole("button", { name: /Důležité/ }).previousElementSibling;
    expect(divider).toHaveAttribute("aria-hidden", "true");
    expect(divider).toHaveClass("ko:w-px", "ko:bg-border-strong");
    expect(screen.getByRole("group").querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
  });

  it("scrolls sideways with the scrollbar hidden, and wraps once the container is wide", () => {
    const { container } = render(<FilterChips label="Filtr" options={options} value="all" onChange={() => {}} />);
    expect(container.firstElementChild).toHaveClass("ko:@container");
    const scroller = container.firstElementChild?.firstElementChild;
    expect(scroller).toHaveClass("ko:overflow-x-auto", "ko:[scrollbar-width:none]", "ko:@[44rem]:overflow-visible");
    expect(screen.getByRole("group")).toHaveClass("ko:w-max", "ko:@[44rem]:flex-wrap");
  });
});
