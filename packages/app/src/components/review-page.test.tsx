import type { Answer } from "@kalkulacka-one/schema";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { LocaleProvider } from "./providers";
import { ReviewPage } from "./review-page";

/*
 * jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same
 * minimum stub the design system's dialog tests use, so the question dialog's
 * own open/close logic runs against something that behaves like a browser.
 */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

const questionIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333", "44444444-4444-4444-8444-444444444444"] as const;
const [q1, q2, q3, q4] = questionIds;
const topics = ["Doprava", "Doprava", "Školství", "Školství"];

const calculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "00000000-0000-4000-8000-000000000000",
      createdAt: new Date(0).toISOString(),
      key: "kalkulacka",
      shortTitle: "Sněmovní 2025",
    },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}`, tags: [topics[index] ?? ""] })),
    candidates: [{ id: "55555555-5555-4555-8555-555555555555", references: [{ id: "66666666-6666-4666-8666-666666666666", type: "organization" }] }],
    candidatesAnswers: {},
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

type RenderOptions = {
  answers?: Answer[];
  props?: Partial<ReviewPage>;
};

function renderPage({ answers = [], props = {} }: RenderOptions = {}) {
  const onBackClick = vi.fn();
  const onShowResultsClick = vi.fn();
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <ReviewPage
            appTitle="Volební kalkulačka"
            electionName="Sněmovní volby 2025"
            calculatorName="Volební kalkulačka"
            onBackClick={onBackClick}
            onShowResultsClick={onShowResultsClick}
            {...props}
          />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );

  const stored = (questionId: string) => answersStore.getState().answers.find((answer) => answer.questionId === questionId);

  return { ...result, answersStore, stored, onBackClick, onShowResultsClick };
}

const yes = (questionId: string): Answer => ({ questionId, answer: true });
const no = (questionId: string): Answer => ({ questionId, answer: false });

/* The app bar, found from its wordmark. */
const appHeader = () => screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header");
const recapHeader = () => document.querySelector(".ko-recap-header");

const list = () => screen.getByRole("list");
const rows = () => within(list()).getAllByRole("listitem");
/* The row's open area is named by the title and the mark's own label, run together — "Otázka 1Ano". */
const opener = (title: string) => screen.getByRole("button", { name: new RegExp(`^${title}(Ano|Ne|Nevím|Bez odpovědi)$`) });
const row = (title: string) => opener(title).closest("li");
const star = (title: string) => within(row(title) as HTMLElement).getByRole("button", { name: "Pro mě důležité" });
const mark = (title: string) => within(row(title) as HTMLElement).getByRole("img");
/* The scroller around the list, and the top fade just before it. */
const scroller = () => list().parentElement as HTMLElement;
const topFade = () => scroller().previousElementSibling;

const chip = (label: string) => screen.getByRole("button", { name: new RegExp(`^${label}\\d*$`) });
const chips = () => within(screen.getByRole("group", { name: "Filtrovat otázky" })).getAllByRole("button");

const dialog = () => document.querySelector("dialog") as HTMLDialogElement;
const statement = () => screen.queryByRole("heading", { level: 2 });

const results = () => screen.getByRole("button", { name: "Zobrazit výsledky" });

describe("ReviewPage", () => {
  describe("the screen", () => {
    it("titles the screen, describes it and tallies the answers", () => {
      renderPage({ answers: [yes(q1), { questionId: q2 }] });
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Rekapitulace");
      expect(screen.getByText("Zkontrolujte odpovědi, než se podíváte na výsledek. Klepnutím na otázku ji můžete změnit.")).toBeInTheDocument();
      expect(screen.getByText("Zodpovězeno 1 z 4")).toBeInTheDocument();
      expect(screen.getByText("Přeskočeno 3")).toBeInTheDocument();
    });

    it("drops the skipped count once everything is answered", () => {
      renderPage({ answers: questionIds.map(yes) });
      expect(screen.getByText("Zodpovězeno 4 z 4")).toBeInTheDocument();
      expect(screen.queryByText(/Přeskočeno/)).toBeNull();
    });

    it("names the election and the calculator in the header", () => {
      renderPage();
      expect(appHeader()).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
    });

    it("renders the header actions and the attribution link when given", () => {
      renderPage({ props: { headerActions: <button type="button">Zavřít</button>, attributionHref: "https://www.volebnikalkulacka.cz" } });
      expect(appHeader()).toContainElement(screen.getByRole("button", { name: "Zavřít" }));
      expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
    });

    it("lists every question as a row wearing its mark", () => {
      renderPage({ answers: [yes(q1), no(q2), { questionId: q3, answer: null }] });
      expect(rows()).toHaveLength(4);
      expect(mark("Otázka 1")).toHaveAccessibleName("Ano");
      expect(mark("Otázka 2")).toHaveAccessibleName("Ne");
      expect(mark("Otázka 3")).toHaveAccessibleName("Nevím");
      expect(mark("Otázka 4")).toHaveAccessibleName("Bez odpovědi");
    });

    it("goes back to the questions", async () => {
      const user = userEvent.setup();
      const { onBackClick, onShowResultsClick } = renderPage();

      await user.click(screen.getByRole("button", { name: "Zpět k otázkám" }));
      expect(onBackClick).toHaveBeenCalledTimes(1);
      expect(onShowResultsClick).not.toHaveBeenCalled();
    });
  });

  describe("the results button", () => {
    it("is disabled until something is answered", async () => {
      const user = userEvent.setup();
      const { onShowResultsClick } = renderPage({ answers: [{ questionId: q1 }] });

      expect(results()).toBeDisabled();
      await user.click(results());
      expect(onShowResultsClick).not.toHaveBeenCalled();
    });

    it("shows the results once there is an answer", async () => {
      const user = userEvent.setup();
      const { onShowResultsClick } = renderPage({ answers: [{ questionId: q1, answer: null }] });

      expect(results()).toBeEnabled();
      await user.click(results());
      expect(onShowResultsClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("filters", () => {
    it("offers Vše and the topics always, Přeskočené and Důležité only when they would leave anything", () => {
      renderPage();
      expect(chips().map((button) => button.textContent)).toEqual(["Vše4", "Přeskočené4", "Doprava2", "Školství2"]);
      expect(chip("Vše")).toHaveAttribute("aria-pressed", "true");
    });

    it("counts the answers into the chips", () => {
      renderPage({ answers: [yes(q1), { questionId: q2, answer: false, isImportant: true }, yes(q3), yes(q4)] });
      expect(chips().map((button) => button.textContent)).toEqual(["Vše4", "Důležité1", "Doprava2", "Školství2"]);
    });

    it("filters the rows", async () => {
      const user = userEvent.setup();
      renderPage({ answers: [yes(q1), { questionId: q2, answer: false, isImportant: true }] });

      await user.click(chip("Důležité"));
      expect(rows()).toHaveLength(1);
      expect(row("Otázka 2")).toBeInTheDocument();

      await user.click(chip("Školství"));
      expect(rows().map((item) => item.textContent)).toEqual(["Otázka 3", "Otázka 4"]);

      await user.click(chip("Přeskočené"));
      expect(rows()).toHaveLength(2);

      await user.click(chip("Vše"));
      expect(rows()).toHaveLength(4);
    });

    it("keys the list on the filter, so switching replays the entrance", async () => {
      const user = userEvent.setup();
      renderPage();
      const before = list();

      await user.click(chip("Doprava"));
      expect(list()).not.toBe(before);
      expect(list()).toHaveClass("koa:animate-(--ko-animate-recap-list-in)");
    });

    it("shows the empty state when the active filter runs dry, and Zobrazit vše returns to everything", async () => {
      const user = userEvent.setup();
      renderPage({ answers: [{ questionId: q1, answer: true, isImportant: true }] });

      await user.click(chip("Důležité"));
      expect(rows()).toHaveLength(1);

      await user.click(star("Otázka 1"));
      expect(screen.queryByRole("list")).toBeNull();
      expect(screen.getByText("V tomto výběru nejsou žádné otázky.")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Zobrazit vše" }));
      expect(rows()).toHaveLength(4);
      expect(chip("Vše")).toHaveAttribute("aria-pressed", "true");
      expect(screen.queryByRole("button", { name: /^Důležité/ })).toBeNull();
    });
  });

  describe("the star", () => {
    it("toggles important right from the row", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage({ answers: [yes(q1)] });

      await user.click(star("Otázka 1"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: true, isImportant: true });
      expect(star("Otázka 1")).toHaveAttribute("aria-pressed", "true");
      expect(statement()).toBeNull();

      await user.click(star("Otázka 1"));
      expect(stored(q1)).toEqual({ questionId: q1, answer: true, isImportant: false });
    });

    it("is locked on a question passed over, but not on one only looked at or never reached", () => {
      renderPage({ answers: [{ questionId: q1, answer: undefined, isImportant: false }, { questionId: q2 }] });
      expect(star("Otázka 1")).toBeDisabled();
      expect(row("Otázka 1")?.firstElementChild).toHaveAttribute("data-secondary");
      expect(star("Otázka 2")).toBeEnabled();
      expect(star("Otázka 3")).toBeEnabled();
    });

    it("stays armable on a question starred before it was answered, and after the star is taken back", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage();

      await user.click(star("Otázka 1"));
      expect(stored(q1)).toEqual({ questionId: q1, isImportant: true });
      expect(star("Otázka 1")).toBeEnabled();
      expect(row("Otázka 1")?.firstElementChild).not.toHaveAttribute("data-secondary");

      // Taking it back leaves the entry as an arrival would, not as a skip — the star must not lock on a mis-tap.
      await user.click(star("Otázka 1"));
      expect(stored(q1)).toEqual({ questionId: q1 });
      expect(star("Otázka 1")).toBeEnabled();
      expect(star("Otázka 1")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("the dialog", () => {
    it("opens the full question from a row", async () => {
      const user = userEvent.setup();
      renderPage({ answers: [yes(q2)] });
      expect(statement()).toBeNull();

      await user.click(opener("Otázka 2"));
      expect(dialog().open).toBe(true);
      expect(statement()).toHaveTextContent("Tvrzení 2");
      expect(within(dialog()).getByRole("button", { name: "Ano" })).toHaveAttribute("aria-pressed", "true");
    });

    it("writes an answer taken in the dialog, updates the row and closes", () => {
      vi.useFakeTimers();
      try {
        const { stored } = renderPage();

        fireEvent.click(opener("Otázka 2"));
        fireEvent.click(within(dialog()).getByRole("button", { name: "Ne" }));
        expect(stored(q2)).toEqual({ questionId: q2, answer: false });
        expect(mark("Otázka 2")).toHaveAccessibleName("Ne");
        expect(screen.getByText("Zodpovězeno 1 z 4")).toBeInTheDocument();

        // The card flies out on the answer; the dialog closes behind the flight.
        act(() => {
          vi.runAllTimers();
        });
        expect(statement()).toBeNull();
        expect(dialog().open).toBe(false);
      } finally {
        vi.useRealTimers();
      }
    });

    it("clears an answer chosen a second time and stays open on the now-empty row", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage({ answers: [{ questionId: q1, answer: true, isImportant: true }] });

      await user.click(opener("Otázka 1"));
      await user.click(within(dialog()).getByRole("button", { name: "Ano" }));
      expect(stored(q1)).toEqual({ questionId: q1, answer: undefined, isImportant: false });
      expect(mark("Otázka 1")).toHaveAccessibleName("Bez odpovědi");
      expect(statement()).toHaveTextContent("Tvrzení 1");
      expect(dialog().open).toBe(true);
    });

    it("skips from the dialog, dropping the star with the position", () => {
      const { stored } = renderPage({ answers: [{ questionId: q1, answer: true, isImportant: true }] });

      fireEvent.click(opener("Otázka 1"));
      fireEvent.keyDown(dialog(), { key: "ArrowDown" });
      expect(stored(q1)).toEqual({ questionId: q1, answer: undefined, isImportant: false });
      expect(mark("Otázka 1")).toHaveAccessibleName("Bez odpovědi");
      expect(star("Otázka 1")).toBeDisabled();
    });

    it("stars from the dialog", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage({ answers: [yes(q3)] });

      await user.click(opener("Otázka 3"));
      await user.click(within(dialog()).getByRole("button", { name: "Pro mě důležité" }));
      expect(stored(q3)).toEqual({ questionId: q3, answer: true, isImportant: true });
      expect(star("Otázka 3")).toHaveAttribute("aria-pressed", "true");
    });

    it("closes on Escape and on the corner close without touching the answer", async () => {
      const user = userEvent.setup();
      const { stored } = renderPage({ answers: [yes(q1)] });

      await user.click(opener("Otázka 1"));
      fireEvent.keyDown(dialog(), { key: "Escape" });
      // The card fades out; the dialog closes once that animation has ended.
      fireEvent.animationEnd(dialog().firstElementChild as Element);
      expect(dialog().open).toBe(false);
      expect(statement()).toBeNull();

      await user.click(opener("Otázka 1"));
      await user.click(within(dialog()).getByRole("button", { name: "Zavřít" }));
      fireEvent.animationEnd(dialog().firstElementChild as Element);
      expect(dialog().open).toBe(false);
      expect(stored(q1)).toEqual({ questionId: q1, answer: true });
    });
  });

  describe("scrolling the list", () => {
    /* jsdom lays nothing out, so the list's extent has to be stated. */
    function scrollable(height: number, viewport: number) {
      Object.defineProperty(scroller(), "scrollHeight", { configurable: true, value: height });
      Object.defineProperty(scroller(), "clientHeight", { configurable: true, value: viewport });
    }

    const scrollTo = (top: number) => fireEvent.scroll(scroller(), { target: { scrollTop: top } });

    it("collapses the header scrolling down and expands it scrolling back up", () => {
      renderPage();
      scrollable(1000, 400);
      expect(recapHeader()).not.toHaveAttribute("data-collapsed");
      expect(topFade()).not.toHaveAttribute("data-visible");

      scrollTo(100);
      expect(recapHeader()).toHaveAttribute("data-collapsed");
      expect(topFade()).toHaveAttribute("data-visible");

      scrollTo(80);
      expect(recapHeader()).not.toHaveAttribute("data-collapsed");

      scrollTo(300);
      expect(recapHeader()).toHaveAttribute("data-collapsed");
    });

    it("ignores small movements and the dead zones at either end", () => {
      renderPage();
      scrollable(1000, 400);

      scrollTo(100);
      scrollTo(96);
      expect(recapHeader()).toHaveAttribute("data-collapsed");

      // The bottom's elastic bounce reports a reverse scroll — not a reason to reopen.
      scrollTo(590);
      scrollTo(585);
      expect(recapHeader()).toHaveAttribute("data-collapsed");

      // Back near the top the header is simply open, whichever way the last move went.
      scrollTo(10);
      expect(recapHeader()).not.toHaveAttribute("data-collapsed");
      expect(topFade()).toHaveAttribute("data-visible");
      scrollTo(0);
      expect(topFade()).not.toHaveAttribute("data-visible");
    });
  });
});
