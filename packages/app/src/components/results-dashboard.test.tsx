import type { Question } from "@kalkulacka-one/schema";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { QuestionConsensus, TopicMatch } from "@/insights";
import { csMessages } from "@/locales";
import type { CandidateViewModel } from "@/view-models";

import { LocaleProvider } from "./providers";
import { ResultsDashboard } from "./results-dashboard";

const candidate = (id: string, displayName: string): CandidateViewModel => ({ id, displayName, references: [] });
const question = (id: string, title: string): Question => ({ id, title, statement: `${title}.` });

const alfa = candidate("alfa", "Alfa");
const beta = candidate("beta", "Beta");
const gama = candidate("gama", "Gama");

const consensus = (id: string, userAnswer: boolean | null, agreeing: CandidateViewModel[], respondedCount: number, important = false): QuestionConsensus => ({
  question: question(id, `Otázka ${id}`),
  userAnswer,
  important,
  agreeing,
  opposing: [],
  respondedCount,
});

const topic = (name: string, best: CandidateViewModel, matchPercentage: number, answeredCount = 3): TopicMatch => ({
  topic: name,
  questionCount: 4,
  answeredCount,
  best: { candidate: best, matchPercentage },
});

const percent = (value: number) => `${Math.round(value)} %`;

const base: React.ComponentProps<typeof ResultsDashboard> = {
  distribution: { agree: 20, disagree: 12, neutral: 3, unanswered: 7, total: 42 },
  topics: [topic("Doprava", alfa, 88, 5), topic("Školství", beta, 66.7)],
  important: [consensus("q1", true, [alfa, beta], 8, true), consensus("q2", false, [], 6, true)],
  againstTheGrain: [consensus("q3", null, [gama], 9)],
  prompt: "Shrnutí.",
  formatPercent: percent,
  onCompareTopicClick: vi.fn(),
  onCompareImportantClick: vi.fn(),
};

function renderDashboard(props: Partial<React.ComponentProps<typeof ResultsDashboard>> = {}) {
  return render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <ResultsDashboard {...base} {...props} />
    </LocaleProvider>,
  );
}

const card = (title: string) => (screen.getByRole("heading", { level: 2, name: title }).closest("section") ?? undefined) as HTMLElement;
/* What a reader sees: the avatars' initials are `aria-hidden` and `textContent` would count them. */
const visibleText = (element: Element) => {
  const clone = element.cloneNode(true) as Element;
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent ?? "";
};
const prompt = () => screen.getByRole("textbox", { name: "Ptejte se dál" }) as HTMLTextAreaElement;

describe("ResultsDashboard", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("titles every card one rung under the screen's own title", () => {
    renderDashboard();
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual([
      "Jak jste odpovídali",
      "Podle témat",
      "Vaše důležité otázky",
      "Kde jste proti proudu",
      "Ptejte se dál",
    ]);
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  describe("how you answered", () => {
    it("draws the split as a ring with the total in the hole and a key beside it", () => {
      renderDashboard();
      const distribution = card("Jak jste odpovídali");
      expect(within(distribution).getByText("42")).toBeInTheDocument();
      expect(within(distribution).getByText("otázek")).toBeInTheDocument();
      expect(
        within(distribution)
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(["Ano20", "Ne12", "Nevím3", "Bez odpovědi7"]);
    });

    it("leaves an empty share out of the key", () => {
      renderDashboard({ distribution: { agree: 5, disagree: 0, neutral: 0, unanswered: 1, total: 6 } });
      expect(
        within(card("Jak jste odpovídali"))
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(["Ano5", "Bez odpovědi1"]);
    });
  });

  describe("by topic", () => {
    it("lists each topic with its icon, its answer count, its closest party and the number, as a way into the comparison", async () => {
      const user = userEvent.setup();
      const onCompareTopicClick = vi.fn();
      renderDashboard({ onCompareTopicClick });
      const topicsCard = card("Podle témat");

      const rows = within(topicsCard).getAllByRole("button");
      expect(rows.map((row) => row.getAttribute("aria-label"))).toEqual(["Porovnat odpovědi k tématu Doprava", "Porovnat odpovědi k tématu Školství"]);
      expect(visibleText(rows[0] as HTMLElement)).toBe("Doprava5Alfa88 %");
      expect(visibleText(rows[1] as HTMLElement)).toBe("Školství3Beta67 %");
      expect(rows[0]?.querySelector("svg")).toBeInTheDocument();

      await user.click(rows[1] as HTMLElement);
      expect(onCompareTopicClick).toHaveBeenCalledWith("Školství");
      expect(within(topicsCard).getByText("Témata s méně než 3 odpověďmi se nezobrazují.")).toBeInTheDocument();
    });

    it("keeps the rows inert without a way into the comparison", () => {
      renderDashboard({ onCompareTopicClick: undefined });
      const topicsCard = card("Podle témat");
      expect(within(topicsCard).queryByRole("button")).toBeNull();
      expect(within(topicsCard).getAllByRole("listitem")).toHaveLength(2);
    });

    it("says why the list is empty", () => {
      renderDashboard({ topics: [] });
      const topicsCard = card("Podle témat");
      expect(within(topicsCard).getByText("Odpovězte na víc otázek a témata se objeví tady.")).toBeInTheDocument();
      expect(within(topicsCard).queryByRole("list")).toBeNull();
      expect(within(topicsCard).queryByText(/nezobrazují/)).toBeNull();
    });
  });

  describe("your important questions", () => {
    it("shows each starred question with the reader's mark, the faces that agreed and the count", async () => {
      const user = userEvent.setup();
      const onCompareImportantClick = vi.fn();
      renderDashboard({ onCompareImportantClick });
      const importantCard = card("Vaše důležité otázky");

      const items = within(importantCard).getAllByRole("listitem");
      expect(items).toHaveLength(2);
      expect(within(items[0] as HTMLElement).getByRole("img", { name: "Ano" })).toBeInTheDocument();
      expect(within(items[0] as HTMLElement).getByText("Otázka q1")).toBeInTheDocument();
      expect(within(items[0] as HTMLElement).getByText("Souhlasí 2 z 8 stran")).toBeInTheDocument();
      // The faces open a captioned list of the parties.
      await user.click(within(items[0] as HTMLElement).getByRole("button", { name: "Strany, které s vámi souhlasí" }));
      expect(screen.getByRole("button", { name: "Zavřít" })).toBeInTheDocument();
      expect(screen.getAllByText("Alfa")).not.toHaveLength(0);

      expect(within(items[1] as HTMLElement).getByRole("img", { name: "Ne" })).toBeInTheDocument();
      expect(within(items[1] as HTMLElement).getByText("Souhlasí 0 z 6 stran")).toBeInTheDocument();
      // Nobody agreed: no stack to open, but the count still says so.
      expect(within(items[1] as HTMLElement).queryByRole("button")).toBeNull();

      await user.click(within(importantCard).getByRole("button", { name: "Porovnat důležité otázky" }));
      expect(onCompareImportantClick).toHaveBeenCalledTimes(1);
    });

    it("drops the action without a way into the comparison", () => {
      renderDashboard({ onCompareImportantClick: undefined });
      expect(within(card("Vaše důležité otázky")).queryByRole("button", { name: "Porovnat důležité otázky" })).toBeNull();
    });

    it("says so when nothing was starred", () => {
      renderDashboard({ important: [] });
      const importantCard = card("Vaše důležité otázky");
      expect(within(importantCard).getByText("Žádnou otázku jste neoznačili jako důležitou.")).toBeInTheDocument();
      expect(within(importantCard).queryByRole("button")).toBeNull();
    });
  });

  describe("against the grain", () => {
    it("shows the share that agreed as a bar rather than as faces", () => {
      renderDashboard();
      const grain = card("Kde jste proti proudu");
      const item = within(grain).getByRole("listitem");

      expect(within(item).getByRole("img", { name: "Nevím" })).toBeInTheDocument();
      expect(within(item).getByText("Otázka q3")).toBeInTheDocument();
      expect(within(item).getByText("Souhlasí 1 z 9 stran")).toBeInTheDocument();
      expect(within(item).queryByRole("button")).toBeNull();
      const meter = item.querySelector('[aria-hidden="true"].ko\\:w-full') as HTMLElement;
      expect(meter).toBeInTheDocument();
      expect((meter.firstElementChild as HTMLElement).style.width).toBe(`${(1 / 9) * 100}%`);
    });

    it("says so when the reader was never in a minority", () => {
      renderDashboard({ againstTheGrain: [] });
      expect(within(card("Kde jste proti proudu")).getByText("U žádné otázky jste nezůstali v menšině.")).toBeInTheDocument();
    });
  });

  describe("the summary", () => {
    it("offers the prompt read-only and says it never leaves the browser", () => {
      renderDashboard();
      expect(prompt().value).toBe("Shrnutí.");
      expect(prompt()).toHaveAttribute("readonly");
      expect(prompt().rows).toBe(7);
      expect(screen.getByText("Shrnutí vzniklo tady v prohlížeči z vašich odpovědí. Nikam se neodesílá.")).toBeInTheDocument();
    });

    it("copies it, reads Zkopírováno for a moment, then offers to copy again", async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
      vi.useFakeTimers();
      try {
        renderDashboard();

        // The copy resolves on a microtask; fake timers leave those alone.
        await act(async () => {
          fireEvent.click(screen.getByRole("button", { name: "Kopírovat shrnutí" }));
        });
        expect(writeText).toHaveBeenCalledWith("Shrnutí.");
        expect(screen.getByRole("button", { name: "Zkopírováno" })).toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(2399);
        });
        expect(screen.getByRole("button", { name: "Zkopírováno" })).toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(1);
        });
        expect(screen.getByRole("button", { name: "Kopírovat shrnutí" })).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it("falls back to selecting the text when the clipboard refuses, and says so for longer", async () => {
      const user = userEvent.setup();
      // After `setup()`: user-event installs a clipboard stub of its own, and this one has to win.
      const writeText = vi.fn().mockRejectedValue(new Error("denied"));
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
      renderDashboard();

      await user.click(screen.getByRole("button", { name: "Kopírovat shrnutí" }));
      expect(screen.getByRole("status")).toHaveTextContent("Zkopírovat se nepodařilo. Text je označený, zkopírujte ho ručně.");
      expect(screen.getByRole("button", { name: "Kopírovat shrnutí" })).toBeInTheDocument();
      expect(prompt()).toHaveFocus();
      expect(prompt().selectionStart).toBe(0);
      expect(prompt().selectionEnd).toBe("Shrnutí.".length);
    });
  });
});
