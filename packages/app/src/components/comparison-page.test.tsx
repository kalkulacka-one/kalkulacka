import type { Answer, CandidatesAnswers } from "@kalkulacka-one/schema";

import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { ComparisonPage } from "./comparison-page";
import { LocaleProvider } from "./providers";

const questionIds = ["11111111-1111-4111-8111-111111111111", "22222222-2222-4222-8222-222222222222", "33333333-3333-4333-8333-333333333333", "44444444-4444-4444-8444-444444444444"] as const;
const [q1, q2, q3, q4] = questionIds;
const topics = ["Doprava", "Doprava", "Školství", "Školství"];

const ids = {
  alfa: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  beta: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  gama: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  delta: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
} as const;

type CandidateAnswers = CandidatesAnswers[string];

const answersFor = (entries: Partial<Record<(typeof questionIds)[number], { answer: boolean | null; comment?: string }>>): CandidateAnswers =>
  Object.entries(entries).map(([questionId, { answer, comment }]) => ({ questionId, answer, ...(comment ? { comment } : {}) }));

/*
 * Against the reader's answers below (yes, no starred, skipped, "nevím"):
 *
 *   beta   yes, no, –, –                        → +1 +2 = +3/3 → 100 %, the winner
 *   alfa   yes (with a comment), yes, no, yes   → +1 −2 = −1/3 → 33 %
 *   gama   no, yes, –, –                        → −1 −2 = −3/3 → 0 %
 *   delta  "nevím" on q1, q2 and q4 (with a comment on q4), nothing on q3
 *
 * So the calculator's order (alfa, beta, gama, delta) is not the ranking's,
 * which is what the face order inside a stack is checked against.
 */
const candidatesAnswers: CandidatesAnswers = {
  [ids.alfa]: answersFor({ [q1]: { answer: true, comment: "Souhlasíme, i když s výhradami." }, [q2]: { answer: true }, [q3]: { answer: false }, [q4]: { answer: true } }),
  [ids.beta]: answersFor({ [q1]: { answer: true }, [q2]: { answer: false } }),
  [ids.gama]: answersFor({ [q1]: { answer: false }, [q2]: { answer: true } }),
  [ids.delta]: answersFor({ [q1]: { answer: null }, [q2]: { answer: null }, [q4]: { answer: null, comment: "Záleží na okolnostech." } }),
};

const calculatorData: CalculatorData = {
  data: {
    calculator: { id: "00000000-0000-4000-8000-000000000000", createdAt: new Date(0).toISOString(), key: "kalkulacka", shortTitle: "Sněmovní 2025" },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}`, tags: [topics[index] ?? ""] })),
    candidates: [
      { id: ids.alfa, displayName: "Alfa", references: [] },
      { id: ids.beta, displayName: "Beta", references: [] },
      { id: ids.gama, displayName: "Gama", references: [] },
      { id: ids.delta, displayName: "Delta", references: [] },
    ],
    candidatesAnswers,
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

const userAnswers: Answer[] = [{ questionId: q1, answer: true }, { questionId: q2, answer: false, isImportant: true }, { questionId: q3 }, { questionId: q4, answer: null }];

/** The same answers with nothing starred — for the case where "Důležité" would leave nothing. */
const unstarredAnswers: Answer[] = userAnswers.map((answer) => ({ ...answer, isImportant: undefined }));

type RenderOptions = {
  answers?: Answer[];
  props?: Partial<ComparisonPage>;
};

function renderPage({ answers = userAnswers, props = {} }: RenderOptions = {}) {
  const onBackClick = vi.fn();
  const onFilterChange = vi.fn();
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <ComparisonPage appTitle="Volební kalkulačka" electionName="Sněmovní volby 2025" calculatorName="Volební kalkulačka" onBackClick={onBackClick} onFilterChange={onFilterChange} {...props} />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );

  return { ...result, onBackClick, onFilterChange };
}

/* The app bar, found from its wordmark. */
const appHeader = () => screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header");

/* The question list is the first list on the page; the groups inside an open card and a stack's popover are lists of their own. */
const questionList = () => screen.getAllByRole("list")[0] as HTMLElement;
const rows = () => Array.from(questionList().children) as HTMLElement[];
const toggle = (row: HTMLElement) => within(row).getByRole("button", { name: /^Tvrzení/ });
const statements = () => rows().map((row) => toggle(row).textContent);
/* By accessible name, where the starred marker follows without the space `textContent` keeps. */
const row = (statement: string) => screen.getByRole("button", { name: new RegExp(`^${statement}( ?\\(Pro mě důležité\\))?$`) }).closest("li") as HTMLElement;

const chips = () => within(screen.getByRole("group", { name: "Filtrovat otázky" })).getAllByRole("button");
const chip = (label: string) => screen.getByRole("button", { name: new RegExp(`^${label}\\d*$`) });

/* A group inside an open card, found from its heading — "Ano2Vy" is the label, the count and the tag run together. */
const group = (row: HTMLElement, heading: RegExp) => within(row).getByRole("heading", { level: 3, name: heading }).closest("section") as HTMLElement;
const groupHeadings = (row: HTMLElement) =>
  within(row)
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);
const partyNames = (section: HTMLElement) =>
  within(section)
    .getAllByRole("listitem")
    .map((item) => within(item).getByText(/^(Alfa|Beta|Gama|Delta)$/).textContent);

/* The popover a stack opens: its rows are avatar plus name, and the name is the last child. */
const stackNames = (stack: HTMLElement) => {
  const panel = document.getElementById(stack.getAttribute("aria-controls") ?? "") as HTMLElement;
  return within(panel)
    .getAllByRole("listitem")
    .map((item) => item.lastElementChild?.textContent);
};

describe("ComparisonPage", () => {
  describe("the screen", () => {
    it("titles the screen, describes it, and offers the way back", () => {
      const { onBackClick } = renderPage();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Porovnání odpovědí");
      expect(screen.getByText("Jak strany odpovídaly na jednotlivé otázky")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Zpět na výsledky" }));
      expect(onBackClick).toHaveBeenCalledTimes(1);
    });

    it("names the election and the calculator in the header, with the actions and the attribution link when given", () => {
      renderPage({ props: { headerActions: <button type="button">Zavřít</button>, attributionHref: "https://www.volebnikalkulacka.cz" } });
      expect(appHeader()).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
      expect(appHeader()).toContainElement(screen.getByRole("button", { name: "Zavřít" }));
      expect(screen.getByRole("link")).toHaveAttribute("href", "https://www.volebnikalkulacka.cz");
    });

    it("lists every question in order, the skipped one included, all collapsed", () => {
      renderPage();
      // The starred one carries its off-screen marker inside the toggle's name.
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2 (Pro mě důležité)", "Tvrzení 3", "Tvrzení 4"]);
      for (const entry of rows()) {
        expect(toggle(entry)).toHaveAttribute("aria-expanded", "false");
      }
    });
  });

  describe("a collapsed row", () => {
    it("shows the reader's mark inside the stack that matches their answer", () => {
      renderPage();

      const first = row("Tvrzení 1");
      const yourMark = within(first).getByRole("img", { name: "Vy: Ano" });
      expect(yourMark).toHaveClass("ko:bg-agree");
      // The "Vy" pill sits in the same pair as the mark, ahead of the faces.
      expect(yourMark.parentElement).toHaveTextContent("Vy");
      expect(within(first).getByRole("button", { name: "Odpověděly ano" })).toBeInTheDocument();
      expect(within(first).getByRole("button", { name: "Odpověděly ne" })).toBeInTheDocument();
      expect(within(first).queryByRole("img", { name: /^Vy: (Ne|Nevím|Bez odpovědi)$/ })).toBeNull();

      const second = row("Tvrzení 2");
      const yourNo = within(second).getByRole("img", { name: "Vy: Ne" });
      expect(yourNo.parentElement).toHaveTextContent("Vy");
      expect(within(second).getByRole("button", { name: "Odpověděly ne" })).toBeInTheDocument();
    });

    it("draws a pair of its own for a skipped or neutral answer, and no stack where nobody stands", () => {
      renderPage();

      // q3: nobody said yes and the reader took no side — so no "ano" pair at all, and the fallback pair carries "Vy".
      const third = row("Tvrzení 3");
      expect(within(third).getByRole("img", { name: "Vy: Bez odpovědi" })).toBeInTheDocument();
      expect(within(third).queryByRole("button", { name: "Odpověděly ano" })).toBeNull();
      expect(within(third).getByRole("button", { name: "Odpověděly ne" })).toBeInTheDocument();
      expect(third.querySelector("[data-has-fallback]")).not.toBeNull();

      // q4: an explicit "nevím" is a real answer, drawn as one.
      const fourth = row("Tvrzení 4");
      expect(within(fourth).getByRole("img", { name: "Vy: Nevím" })).toHaveClass("ko:bg-neutral-ink");
      expect(within(fourth).queryByRole("button", { name: "Odpověděly ne" })).toBeNull();

      expect(row("Tvrzení 1").querySelector("[data-has-fallback]")).toBeNull();
    });

    it("orders the faces in a stack by the reader's ranking, not the calculator's", () => {
      renderPage();

      // q1's "ano": alfa and beta in data order, beta first by ranking.
      const yesStack = within(row("Tvrzení 1")).getByRole("button", { name: "Odpověděly ano" });
      fireEvent.click(yesStack);
      expect(stackNames(yesStack)).toEqual(["Beta", "Alfa"]);

      // q2's "ano": alfa (33 %) ahead of gama (0 %).
      const secondStack = within(row("Tvrzení 2")).getByRole("button", { name: "Odpověděly ano" });
      fireEvent.click(secondStack);
      expect(stackNames(secondStack)).toEqual(["Alfa", "Gama"]);
    });
  });

  describe("expanding", () => {
    it("opens the three groups with their counts and the reader's tag, and puts the summary line away", () => {
      renderPage();
      const first = row("Tvrzení 1");
      fireEvent.click(toggle(first));

      expect(toggle(first)).toHaveAttribute("aria-expanded", "true");
      expect(first).toHaveAttribute("data-expanded");
      expect(groupHeadings(first)).toEqual(["Ano2Vy", "Ne1", "Nevím / bez odpovědi1"]);
      expect(within(first).queryByRole("button", { name: "Odpověděly ano" })).toBeNull();
      expect(within(first).queryByRole("img", { name: "Vy: Ano" })).toBeNull();

      // Faces by ranking inside the group too, each party's comment straight under its name.
      const yes = group(first, /^Ano/);
      expect(partyNames(yes)).toEqual(["Beta", "Alfa"]);
      expect(within(yes).getByText("Souhlasíme, i když s výhradami.")).toBeInTheDocument();
      expect(partyNames(group(first, /^Ne1/))).toEqual(["Gama"]);
      expect(partyNames(group(first, /^Nevím/))).toEqual(["Delta"]);

      // The other rows stay as they were.
      expect(toggle(row("Tvrzení 2"))).toHaveAttribute("aria-expanded", "false");
    });

    it("collapses again on a second press", () => {
      renderPage();
      const first = row("Tvrzení 1");
      fireEvent.click(toggle(first));
      fireEvent.click(toggle(first));

      expect(toggle(first)).toHaveAttribute("aria-expanded", "false");
      expect(first).not.toHaveAttribute("data-expanded");
      expect(within(first).queryByRole("heading", { level: 3 })).toBeNull();
      expect(within(first).getByRole("button", { name: "Odpověděly ano" })).toBeInTheDocument();
    });

    it("tags the group holding the reader's own side, whichever it is", () => {
      renderPage();

      const second = row("Tvrzení 2");
      fireEvent.click(toggle(second));
      expect(groupHeadings(second)).toEqual(["Ano2", "Ne1Vy", "Nevím / bez odpovědi1"]);

      const third = row("Tvrzení 3");
      fireEvent.click(toggle(third));
      expect(groupHeadings(third)).toEqual(["Ne1", "Nevím / bez odpovědi3Vy"]);
    });

    it("marks each party in the merged group, telling an explicit shrug from silence", () => {
      renderPage();
      const fourth = row("Tvrzení 4");
      fireEvent.click(toggle(fourth));

      const other = group(fourth, /^Nevím/);
      // Neutrals first — delta's "nevím" with its comment — then the silent, in data order.
      expect(partyNames(other)).toEqual(["Delta", "Beta", "Gama"]);
      expect(
        within(other)
          .getAllByRole("img")
          .map((mark) => mark.getAttribute("aria-label")),
      ).toEqual(["Nevím", "Bez odpovědi", "Bez odpovědi"]);
      expect(within(other).getByText("Záleží na okolnostech.")).toBeInTheDocument();
      // The yes/no groups say it in the header instead.
      expect(within(group(fourth, /^Ano/)).queryByRole("img")).toBeNull();
    });
  });

  describe("filters", () => {
    it("offers everything, the starred questions and every topic, counted", () => {
      renderPage();
      expect(chips().map((entry) => entry.textContent)).toEqual(["Vše4", "Důležité1", "Doprava2", "Školství2"]);
      expect(chip("Vše")).toHaveAttribute("aria-pressed", "true");
    });

    it("narrows the list to the chip picked and tells the app which one, in route terms", () => {
      const { onFilterChange } = renderPage();

      fireEvent.click(chip("Důležité"));
      expect(statements()).toEqual(["Tvrzení 2 (Pro mě důležité)"]);
      expect(onFilterChange).toHaveBeenLastCalledWith("important");

      fireEvent.click(chip("Školství"));
      expect(statements()).toEqual(["Tvrzení 3", "Tvrzení 4"]);
      expect(onFilterChange).toHaveBeenLastCalledWith({ topic: "skolstvi" });

      fireEvent.click(chip("Vše"));
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2 (Pro mě důležité)", "Tvrzení 3", "Tvrzení 4"]);
      expect(onFilterChange).toHaveBeenLastCalledWith(undefined);
      expect(onFilterChange).toHaveBeenCalledTimes(3);
    });

    it("collapses every open card when the filter changes", () => {
      renderPage();
      fireEvent.click(toggle(row("Tvrzení 1")));
      expect(toggle(row("Tvrzení 1"))).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(chip("Doprava"));
      expect(statements()).toEqual(["Tvrzení 1", "Tvrzení 2 (Pro mě důležité)"]);
      expect(toggle(row("Tvrzení 1"))).toHaveAttribute("aria-expanded", "false");
    });

    it("offers the starred filter only when something is starred", () => {
      renderPage({ answers: unstarredAnswers });
      expect(chips().map((entry) => entry.textContent)).toEqual(["Vše4", "Doprava2", "Školství2"]);
    });

    it("says so when a filter leaves nothing, and offers the way out", () => {
      const { onFilterChange } = renderPage({ answers: unstarredAnswers, props: { initialFilter: "important" } });
      expect(screen.getByText("Tomuhle filtru neodpovídá žádná otázka.")).toBeInTheDocument();
      expect(screen.queryAllByRole("list")).toHaveLength(0);

      fireEvent.click(screen.getByRole("button", { name: "Zobrazit všechny" }));
      expect(statements()).toHaveLength(4);
      expect(chip("Vše")).toHaveAttribute("aria-pressed", "true");
      expect(onFilterChange).toHaveBeenLastCalledWith(undefined);
    });
  });

  describe("arriving with a filter", () => {
    it("starts on the starred questions", () => {
      renderPage({ props: { initialFilter: "important" } });
      expect(chip("Důležité")).toHaveAttribute("aria-pressed", "true");
      expect(statements()).toEqual(["Tvrzení 2 (Pro mě důležité)"]);
    });

    it("starts on a topic named by its slug", () => {
      renderPage({ props: { initialFilter: { topic: "skolstvi" } } });
      expect(chip("Školství")).toHaveAttribute("aria-pressed", "true");
      expect(statements()).toEqual(["Tvrzení 3", "Tvrzení 4"]);
    });

    it("falls back to everything for a slug that names no topic", () => {
      const { onFilterChange } = renderPage({ props: { initialFilter: { topic: "neznamy" } } });
      expect(chip("Vše")).toHaveAttribute("aria-pressed", "true");
      expect(statements()).toHaveLength(4);
      // Arrival is not a change: the URL is the app's to keep, not to rewrite unasked.
      expect(onFilterChange).not.toHaveBeenCalled();
    });
  });
});
