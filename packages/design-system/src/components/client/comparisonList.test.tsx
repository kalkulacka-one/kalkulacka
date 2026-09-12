import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ComparisonList, type ComparisonRow } from "./comparisonList";

const labels = { you: "Vy", candidate: "Piráti", important: "Pro mě důležité" };

const rows: ComparisonRow[] = [
  {
    id: "q1",
    statement: "Město by mělo omezit vánoční výzdobu kvůli cenám energií.",
    user: { tone: "agree", label: "Ano" },
    candidate: { tone: "agree", label: "Ano" },
    important: true,
    comment: "Úspory dávají smysl, výzdobu ale zcela rušit nechceme.",
  },
  {
    id: "q2",
    statement: "Město má vybudovat nový plavecký areál.",
    user: { tone: "disagree", label: "Ne" },
    candidate: { tone: "agree", label: "Ano" },
  },
  {
    id: "q3",
    statement: "Parkování v centru má zdražit.",
    user: { tone: "agree", label: "Ano" },
    candidate: { tone: "none", label: "Bez odpovědi" },
  },
];

const items = () => screen.getAllByRole("listitem");

describe("ComparisonList", () => {
  it("lists every row in the order given, each with the candidate's mark before the reader's", () => {
    render(<ComparisonList rows={rows} labels={labels} />);
    expect(items()).toHaveLength(3);
    expect(items().map((item) => within(item).getByText(/^(Město|Parkování)/).textContent)).toEqual([
      "Město by mělo omezit vánoční výzdobu kvůli cenám energií. (Pro mě důležité)",
      "Město má vybudovat nový plavecký areál.",
      "Parkování v centru má zdražit.",
    ]);

    const marks = within(items()[1] as HTMLElement).getAllByRole("img");
    expect(marks.map((mark) => mark.getAttribute("aria-label"))).toEqual(["Piráti: Ano", "Vy: Ne"]);
  });

  it("names the answers for a screen reader, including the one nobody gave", () => {
    render(<ComparisonList rows={rows} labels={labels} />);
    expect(screen.getByRole("img", { name: "Piráti: Bez odpovědi" })).toHaveClass("ko:border-dashed");
    expect(screen.getAllByRole("img", { name: "Vy: Ano" })).toHaveLength(2);
  });

  it("heads the two mark columns with the reader and the candidate, hidden from assistive tech", () => {
    const { container } = render(<ComparisonList rows={rows} labels={labels} />);
    const head = container.querySelector('[aria-hidden="true"]');
    expect(head).toHaveTextContent("PirátiVy");
    expect(head).toHaveClass("ko:sticky", "ko:top-0");
    // The candidate's label may run across the statement column; "Vy" stays in its own.
    expect(head?.firstElementChild).toHaveClass("ko:col-start-1", "ko:col-end-3", "ko:text-right");
    expect(head?.lastElementChild).toHaveClass("ko:col-start-3", "ko:text-center");
  });

  it("stars an important question with the design system's own mark and says so off-screen", () => {
    render(<ComparisonList rows={rows} labels={labels} />);
    const [starred, plain] = items() as HTMLElement[];
    // Inside the statement — the marks beside it are SVGs of their own.
    expect(starred?.querySelector("p svg")).toHaveAttribute("aria-hidden", "true");
    expect(starred?.querySelector("p svg")).toHaveAttribute("fill", "currentColor");
    expect(within(starred as HTMLElement).getByText("(Pro mě důležité)")).toHaveClass("ko:sr-only");
    expect(plain?.querySelector("p svg")).toBeNull();
    expect(within(plain as HTMLElement).queryByText("(Pro mě důležité)")).toBeNull();
  });

  it("quotes the candidate's own comment under the statement, and only where there is one", () => {
    render(<ComparisonList rows={rows} labels={labels} />);
    const comment = screen.getByText("Úspory dávají smysl, výzdobu ale zcela rušit nechceme.");
    expect(comment.tagName).toBe("P");
    expect(comment).toHaveClass("ko:col-span-full", "ko:xs:col-start-1");
    expect(items()[1]?.querySelectorAll("p")).toHaveLength(1);
  });

  it("remounts the list when the reset key changes, so the entrance replays", () => {
    const { rerender } = render(<ComparisonList rows={rows} labels={labels} resetKey="all" />);
    const before = screen.getByRole("list");
    expect(before).toHaveClass("ko:animate-recap-list-in", "ko:motion-reduce:animate-none");

    rerender(<ComparisonList rows={rows} labels={labels} resetKey="all" />);
    expect(screen.getByRole("list")).toBe(before);

    rerender(<ComparisonList rows={rows} labels={labels} resetKey="match" />);
    expect(screen.getByRole("list")).not.toBe(before);
  });

  it("renders an empty list without a row", () => {
    render(<ComparisonList rows={[]} labels={labels} />);
    expect(screen.getByRole("list")).toBeEmptyDOMElement();
  });
});
