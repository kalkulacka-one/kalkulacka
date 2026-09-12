import type { Answer, CandidatesAnswers } from "@kalkulacka-one/schema";

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@/client/stores";
import type { CalculatorData } from "@/data-fetching";
import { csMessages } from "@/locales";

import { CLOSE_MS } from "./comparison-pane";
import { LocaleProvider } from "./providers";
import { CALCULATING_MS, ResultPage, seenKey } from "./result-page";

const calculatorId = "00000000-0000-4000-8000-000000000000";

const questionIds = [
  "11111111-1111-4111-8111-111111111111",
  "22222222-2222-4222-8222-222222222222",
  "33333333-3333-4333-8333-333333333333",
  "44444444-4444-4444-8444-444444444444",
  "55555555-5555-4555-8555-555555555555",
  "66666666-6666-4666-8666-666666666666",
] as const;
const [q1, q2, q3, q4, q5, q6] = questionIds;
/* Three questions per topic, so a topic clears `MIN_TOPIC_ANSWERS` only when all three are answered. */
const topics = ["Doprava", "Doprava", "Doprava", "Školství", "Školství", "Školství"];

const ids = {
  alfa: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  beta: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  gama: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  delta: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  /** The party behind Delta: the row is headed by its full name, the pane by its short one. */
  deltaParty: "d0d0d0d0-d0d0-4d0d-8d0d-d0d0d0d0d0d0",
  epsilon: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
  zeta: "ffffffff-ffff-4fff-8fff-ffffffffffff",
  ghost: "99999999-9999-4999-8999-999999999999",
  coalition: "10101010-1010-4101-8101-101010101010",
  marie: "20202020-2020-4202-8202-202020202020",
  martin: "30303030-3030-4303-8303-303030303030",
} as const;

type CandidateAnswers = CandidatesAnswers[string];

const answersFor = (entries: Partial<Record<(typeof questionIds)[number], boolean | null>>, respondent: "candidate" | "expert" = "candidate"): CandidateAnswers =>
  Object.entries(entries).map(([questionId, answer]) => ({ questionId, answer, respondent }));

/*
 * Seven parties. Worked out by hand against the user's answers below (yes, no,
 * yes starred, skipped, no, yes — five answered, the starred one weighing
 * double, so six units of weight):
 *
 *   delta   answers exactly as the user → +6/6 → 100 %, the winner
 *   alfa    yes on everything → +1 −1 +2 −1 +1 = +2/6 → 67 %
 *   gama    yes, then no on the rest → +1 +1 −2 +1 −1 = 0/6 → 50 %
 *   epsilon "nevím" on everything → 0/6 → 50 %, after gama (ties break on the id)
 *   beta    no on everything (an expert's reading) → −1 +1 −2 +1 −1 = −2/6 → 33 %
 *   zeta    no on q1 and q6 only → −2/2 → 0 %
 *   ghost   never answered → no percentage, unranked, last
 */
const candidatesAnswers: CandidatesAnswers = {
  [ids.alfa]: answersFor({ [q1]: true, [q2]: true, [q3]: true, [q4]: true, [q5]: true, [q6]: true }),
  [ids.beta]: answersFor({ [q1]: false, [q2]: false, [q3]: false, [q4]: false, [q5]: false, [q6]: false }, "expert"),
  [ids.gama]: answersFor({ [q1]: true, [q2]: false, [q3]: false, [q4]: false, [q5]: false, [q6]: false }),
  [ids.delta]: answersFor({ [q1]: true, [q2]: false, [q3]: true, [q4]: true, [q5]: false, [q6]: true }),
  [ids.epsilon]: answersFor({ [q1]: null, [q2]: null, [q3]: null, [q4]: null, [q5]: null, [q6]: null }),
  [ids.zeta]: answersFor({ [q1]: false, [q6]: false }),
};

const calculatorData: CalculatorData = {
  data: {
    calculator: {
      id: calculatorId,
      createdAt: new Date(0).toISOString(),
      key: "kalkulacka",
      shortTitle: "Sněmovní 2025",
    },
    questions: questionIds.map((id, index) => ({ id, title: `Otázka ${index + 1}`, statement: `Tvrzení ${index + 1}`, tags: [topics[index] ?? ""] })),
    candidates: [
      { id: ids.alfa, displayName: "Alfa", references: [] },
      { id: ids.beta, displayName: "Beta", references: [] },
      { id: ids.gama, displayName: "Gama", references: [] },
      { id: ids.delta, references: [{ id: ids.deltaParty, type: "organization" }] },
      { id: ids.epsilon, displayName: "Epsilon", references: [] },
      { id: ids.zeta, displayName: "Zeta", references: [] },
      { id: ids.ghost, displayName: "Ghost", references: [] },
    ],
    candidatesAnswers,
    organizations: [{ id: ids.deltaParty, name: "Demokratická strana", shortName: "Delta", abbreviation: "DS" }],
  },
  baseUrl: "https://data.kalkulacka.one/kalkulacka",
};

/** A coalition with nobody's answers of its own, scored on the two people on its list. */
const nestedCalculatorData: CalculatorData = {
  ...calculatorData,
  data: {
    ...calculatorData.data,
    candidates: [
      {
        id: ids.coalition,
        displayName: "Koalice",
        references: [],
        nestedCandidates: [
          { id: ids.marie, displayName: "Marie", references: [] },
          { id: ids.martin, displayName: "Martin", references: [] },
        ],
      },
    ],
    candidatesAnswers: {
      [ids.marie]: answersFor({ [q1]: true, [q2]: false, [q3]: true }),
      [ids.martin]: answersFor({ [q1]: false, [q2]: true, [q3]: false }),
    },
  },
};

const userAnswers: Answer[] = [
  { questionId: q1, answer: true },
  { questionId: q2, answer: false },
  { questionId: q3, answer: true, isImportant: true },
  { questionId: q4 },
  { questionId: q5, answer: false },
  { questionId: q6, answer: true },
];

type RenderOptions = {
  answers?: Answer[];
  data?: CalculatorData;
  props?: Partial<ResultPage>;
  /** Whether the session has already seen this ranking — the default, so the beat doesn't stand in the way of every test. */
  seen?: boolean;
};

function renderPage({ answers = userAnswers, data = calculatorData, props = {}, seen = true }: RenderOptions = {}) {
  if (seen) window.sessionStorage.setItem(seenKey(calculatorId), "1");

  const handlers = {
    onBackClick: vi.fn(),
    onCompareClick: vi.fn(),
    onCompareTopicClick: vi.fn(),
    onCompareImportantClick: vi.fn(),
    onShareClick: vi.fn(),
    onStartOwnClick: vi.fn(),
  };
  const answersStore = createAnswersStore();
  answersStore.getState().setAnswers(answers);

  const result = render(
    <LocaleProvider locale="cs" messages={csMessages}>
      <CalculatorStoreContext.Provider value={createCalculatorStore(data)}>
        <AnswersStoreContext.Provider value={answersStore}>
          <ResultPage appTitle="Volební kalkulačka" electionName="Sněmovní volby 2025" calculatorName="Volební kalkulačka" {...handlers} {...props} />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>
    </LocaleProvider>,
  );

  return { ...result, ...handlers };
}

const heading = () => screen.getByRole("heading", { level: 1 });
/* The ranking is the first list on the page; the dashboard's lists follow it. */
const ranking = () => screen.getAllByRole("list")[0] as HTMLElement;
const rows = () => within(ranking()).getAllByRole("listitem");
const rowButton = (name: string) => within(ranking()).getByRole("button", { name: new RegExp(name) });
/* What a reader sees: the avatars' initials are `aria-hidden` and `textContent` would count them. */
const visibleText = (element: Element) => {
  const clone = element.cloneNode(true) as Element;
  for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
  return clone.textContent ?? "";
};
const card = (title: string) => (screen.getByRole("heading", { level: 2, name: title }).closest("section") ?? undefined) as HTMLElement;
const prompt = () => screen.getByRole("textbox", { name: "Ptejte se dál" }) as HTMLTextAreaElement;

describe("ResultPage", () => {
  afterEach(() => {
    window.sessionStorage.clear();
  });

  describe("the calculating beat", () => {
    it("shows the loader first, then the ranking after the beat, and remembers the reveal for the session", () => {
      vi.useFakeTimers();
      try {
        renderPage({ seen: false });
        expect(screen.getByRole("status")).toHaveTextContent("Počítáme vaši shodu");
        expect(screen.queryByRole("heading", { level: 1 })).toBeNull();

        act(() => {
          vi.advanceTimersByTime(CALCULATING_MS - 1);
        });
        expect(screen.getByRole("status")).toBeInTheDocument();

        act(() => {
          vi.advanceTimersByTime(1);
        });
        expect(screen.queryByRole("status")).toBeNull();
        expect(heading()).toHaveTextContent("Moje shoda");
        expect(window.sessionStorage.getItem(seenKey(calculatorId))).toBe("1");

        // Revealed once: the rows rose into place with their stagger.
        expect((rows()[0] as HTMLElement).style.animationDelay).toBe("0.24s");
      } finally {
        vi.useRealTimers();
      }
    });

    it("is skipped on a revisit, and the rows land without their entrance", () => {
      renderPage();
      expect(screen.queryByRole("status")).toBeNull();
      expect(heading()).toHaveTextContent("Moje shoda");
      for (const row of rows()) expect((row as HTMLElement).style.animationDelay).toBe("-1s");
    });

    it("is skipped on a shared result, which is never remembered as seen", () => {
      renderPage({ seen: false, props: { shared: true } });
      expect(screen.queryByRole("status")).toBeNull();
      expect(heading()).toHaveTextContent("Sdílená shoda");
      expect(window.sessionStorage.getItem(seenKey(calculatorId))).toBeNull();
    });
  });

  describe("with nothing answered", () => {
    it("says there is nothing to calculate and offers the questions", async () => {
      const user = userEvent.setup();
      const { onBackClick } = renderPage({ answers: [{ questionId: q1 }] });

      expect(heading()).toHaveTextContent("Zatím není co počítat");
      expect(screen.getByText("Odpovězte alespoň na jednu otázku a shoda se objeví tady.")).toBeInTheDocument();
      expect(screen.queryByRole("list")).toBeNull();

      await user.click(screen.getByRole("button", { name: "Přejít na otázky" }));
      expect(onBackClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("the ranking", () => {
    it("titles the screen, invites the reader to open a row, and names the election in the header", () => {
      renderPage();
      expect(heading()).toHaveTextContent("Moje shoda");
      expect(screen.getByText("Tapnutím na stranu můžete porovnat svoje odpovědi")).toBeInTheDocument();
      expect(screen.getByText("Volební kalkulačka", { selector: "p" }).closest("header")).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");
    });

    it("shows the first five rows, ranked, with the winner captioned", () => {
      renderPage();
      expect(rows()).toHaveLength(5);
      expect(rows().map(visibleText)).toEqual([
        "Největší shoda1.Demokratická strana100\u00a0%",
        "2.Alfa67\u00a0%",
        "3.Gama50\u00a0%",
        "4.Epsilon50\u00a0%",
        "5.BetaPostoje podle veřejných zdrojů, strana neodpověděla na zaslané otázky.33\u00a0%",
      ]);
      expect(within(rows()[0] as HTMLElement).getByText("Největší shoda")).toBeInTheDocument();
      // The percent is written the Czech way, with a no-break space before the sign.
      expect(within(rows()[0] as HTMLElement).getByText("100 %").textContent).toBe("100\u00a0%");
    });

    it("staggers the entrance from the bottom up, so the winner lands last", () => {
      vi.useFakeTimers();
      try {
        renderPage({ seen: false });
        act(() => {
          vi.advanceTimersByTime(CALCULATING_MS);
        });
        expect(rows().map((row) => (row as HTMLElement).style.animationDelay)).toEqual(["0.24s", "0.18s", "0.12s", "0.06s", ""]);
      } finally {
        vi.useRealTimers();
      }
    });

    it("notes a row filled in by an expert under the party's name", () => {
      renderPage();
      const beta = rowButton("Beta");
      expect(within(beta).getByText("Postoje podle veřejných zdrojů, strana neodpověděla na zaslané otázky.")).toBeInTheDocument();
      expect(within(rowButton("Alfa")).queryByText(/Postoje podle/)).toBeNull();
    });

    it("unfolds the tail on request, once, keeping a party that never answered last and unranked", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(screen.getByRole("button", { name: "Zobrazit další strany (2)" }));
      expect(screen.queryByRole("button", { name: /Zobrazit další strany/ })).toBeNull();
      expect(rows()).toHaveLength(7);
      expect(rows()[5]).toHaveTextContent("6.Zeta0 %");

      const ghost = rows()[6] as HTMLElement;
      expect(ghost).toHaveTextContent("GhostNeodpověděli");
      expect(within(ghost).getByRole("button")).toBeDisabled();
      expect(within(ghost).queryByText(/^\d+\.$/)).toBeNull();
    });

    it("marks the chosen row as the open one", async () => {
      const user = userEvent.setup();
      renderPage();

      await user.click(rowButton("Alfa"));
      expect(rowButton("Alfa")).toHaveAttribute("aria-pressed", "true");
      expect(rowButton("Demokratická strana")).toHaveAttribute("aria-pressed", "false");

      await user.click(rowButton("Demokratická strana"));
      expect(rowButton("Demokratická strana")).toHaveAttribute("aria-pressed", "true");
      expect(rowButton("Alfa")).toHaveAttribute("aria-pressed", "false");
    });

    it("heads a party's row and the pane by its full name, and keeps the short one for the columns", async () => {
      const user = userEvent.setup();
      renderPage();

      expect(rowButton("Demokratická strana")).toBeInTheDocument();
      expect(within(ranking()).queryByRole("button", { name: /^1\. Delta/ })).toBeNull();

      await user.click(rowButton("Demokratická strana"));
      expect(screen.getByRole("region", { name: "Demokratická strana" })).toBeInTheDocument();
    });

    it("goes back, shares and compares through the app", async () => {
      const user = userEvent.setup();
      const { onBackClick, onShareClick, onCompareClick } = renderPage();

      await user.click(screen.getByRole("button", { name: "Zpět na rekapitulaci" }));
      await user.click(screen.getByRole("button", { name: "Sdílet" }));
      await user.click(screen.getByRole("button", { name: "Porovnat odpovědi" }));
      expect(onBackClick).toHaveBeenCalledTimes(1);
      expect(onShareClick).toHaveBeenCalledTimes(1);
      expect(onCompareClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("the donate card", () => {
    const donateCard = <div data-testid="donate">Podpořte nás</div>;
    const position = () => rows().findIndex((row) => within(row as HTMLElement).queryByTestId("donate") !== null);

    it("rides the list after the n-th row", () => {
      renderPage({ props: { donateCard, donateCardPosition: 2 } });
      expect(rows()).toHaveLength(6);
      expect(position()).toBe(2);
      expect(rows()[2]).not.toHaveClass("ko-pressable");
    });

    it("leads the list at position 0", () => {
      renderPage({ props: { donateCard, donateCardPosition: 0 } });
      expect(position()).toBe(0);
    });

    it("waits for the fold to open when its position lies past the fifth row", async () => {
      const user = userEvent.setup();
      renderPage({ props: { donateCard, donateCardPosition: 6 } });
      expect(screen.queryByTestId("donate")).toBeNull();

      await user.click(screen.getByRole("button", { name: /Zobrazit další strany/ }));
      expect(position()).toBe(6);
    });

    it("stays out without a position", () => {
      renderPage({ props: { donateCard } });
      expect(screen.queryByTestId("donate")).toBeNull();
    });
  });

  describe("candidate lists with people on them", () => {
    it("offers the switch only when there is something nested, and swaps the rows", async () => {
      const user = userEvent.setup();
      renderPage({
        data: nestedCalculatorData,
        answers: [
          { questionId: q1, answer: true },
          { questionId: q2, answer: false },
        ],
      });

      const chips = screen.getByRole("group", { name: "Zobrazení výsledků" });
      expect(within(chips).getByRole("button", { name: "Kandidátní listiny" })).toHaveAttribute("aria-pressed", "true");
      expect(rows().map(visibleText)).toEqual(["Největší shoda1.Koalice50\u00a0%"]);

      await user.click(within(chips).getByRole("button", { name: "Lidé" }));
      expect(within(chips).getByRole("button", { name: "Lidé" })).toHaveAttribute("aria-pressed", "true");
      expect(rows().map(visibleText)).toEqual(["Největší shoda1.Marie100\u00a0%", "2.Martin0\u00a0%"]);
    });

    it("is not offered for a flat list of parties", () => {
      renderPage();
      expect(screen.queryByRole("group", { name: "Zobrazení výsledků" })).toBeNull();
    });
  });

  describe("a shared result", () => {
    it("says whose result it is and offers the visitor their own calculator instead of the ways out of this one", async () => {
      const user = userEvent.setup();
      const { onStartOwnClick, onCompareClick } = renderPage({ props: { shared: true } });

      expect(screen.getByText("Tenhle výsledek s vámi někdo sdílel. Vaše vlastní odpovědi zůstávají nedotčené.")).toBeInTheDocument();
      expect(screen.queryByText("Tapnutím na stranu můžete porovnat svoje odpovědi")).toBeNull();
      expect(screen.queryByRole("button", { name: "Zpět na rekapitulaci" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Sdílet" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Porovnat odpovědi" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Porovnat důležité otázky" })).toBeNull();
      expect(screen.queryByRole("button", { name: /Porovnat odpovědi k tématu/ })).toBeNull();
      // The tail still unfolds; only the comparisons go.
      expect(screen.getByRole("button", { name: "Zobrazit další strany (2)" })).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Vyplnit vlastní kalkulačku" }));
      expect(onStartOwnClick).toHaveBeenCalledTimes(1);
      expect(onCompareClick).not.toHaveBeenCalled();
    });
  });

  describe("the comparison pane", () => {
    const region = (name: string) => screen.getByRole("region", { name });

    it("takes the dashboard's place when a row is opened, headed by the candidate and focused there", async () => {
      const user = userEvent.setup();
      renderPage();
      expect(screen.getByRole("heading", { level: 2, name: "Jak jste odpovídali" })).toBeInTheDocument();

      await user.click(rowButton("Alfa"));
      expect(screen.queryByRole("heading", { level: 2, name: "Jak jste odpovídali" })).toBeNull();
      expect(screen.getByRole("heading", { level: 2, name: "Alfa" })).toHaveFocus();
      // Written the Czech way, with a no-break space before the sign — the same formatter the rows use.
      expect(within(region("Alfa")).getByText("67 %").textContent).toBe("67\u00a0%");
      // Only the five answered questions, in order; the skipped fourth says nothing about either side.
      expect(
        within(region("Alfa"))
          .getAllByRole("listitem")
          .map((row) => within(row as HTMLElement).getByText(/^Tvrzení/).textContent),
      ).toEqual(["Tvrzení 1", "Tvrzení 2", "Tvrzení 3 (Pro mě důležité)", "Tvrzení 5", "Tvrzení 6"]);
      expect(within(region("Alfa")).getByRole("group", { name: "Filtrovat odpovědi" })).toHaveTextContent("Vše5Shody3Neshody2Důležité1");
    });

    it("closes on Escape after the exit beat, and puts focus back on the row that opened it", () => {
      vi.useFakeTimers();
      try {
        renderPage();
        const row = rowButton("Demokratická strana");
        row.focus();
        fireEvent.click(row);
        expect(screen.getByRole("heading", { level: 2, name: "Demokratická strana" })).toHaveFocus();
        // Delta answered exactly as the reader did: nothing to filter as a mismatch.
        expect(within(region("Demokratická strana")).getByRole("group", { name: "Filtrovat odpovědi" })).toHaveTextContent("Vše5Shody5Důležité1");

        fireEvent.keyDown(window, { key: "Escape" });
        expect(row).toHaveAttribute("aria-pressed", "false");
        expect(row).toHaveFocus();
        // Still rendered while the pane animates out…
        expect(region("Demokratická strana")).toHaveAttribute("data-closing");

        act(() => {
          vi.advanceTimersByTime(CLOSE_MS);
        });
        // …then the dashboard is back.
        expect(screen.queryByRole("region")).toBeNull();
        expect(screen.getByRole("heading", { level: 2, name: "Jak jste odpovídali" })).toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });

    it("closes when the ranking switches to the people on the lists", async () => {
      const user = userEvent.setup();
      renderPage({
        data: nestedCalculatorData,
        answers: [
          { questionId: q1, answer: true },
          { questionId: q2, answer: false },
        ],
      });

      await user.click(rowButton("Koalice"));
      expect(region("Koalice")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Lidé" }));
      expect(screen.queryByRole("region")).toBeNull();
      expect(rowButton("Marie")).toHaveAttribute("aria-pressed", "false");

      await user.click(rowButton("Marie"));
      expect(region("Marie")).toBeInTheDocument();
    });
  });

  describe("the dashboard", () => {
    it("counts how the reader answered", () => {
      renderPage();
      const distribution = card("Jak jste odpovídali");
      expect(within(distribution).getByText("6")).toBeInTheDocument();
      expect(within(distribution).getByText("otázek")).toBeInTheDocument();
      expect(
        within(distribution)
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(["Ano3", "Ne2", "Bez odpovědi1"]);
    });

    it("names the closest party per topic with enough answers behind it, and opens the comparison on that topic", async () => {
      const user = userEvent.setup();
      const { onCompareTopicClick } = renderPage();
      const topicsCard = card("Podle témat");

      // Školství has only two answers behind it; Doprava all three.
      expect(within(topicsCard).getAllByRole("listitem")).toHaveLength(1);
      const row = within(topicsCard).getByRole("button", { name: "Porovnat odpovědi k tématu Doprava" });
      expect(visibleText(row)).toBe("Doprava3Delta100\u00a0%");
      expect(within(topicsCard).getByText("Témata s méně než 3 odpověďmi se nezobrazují.")).toBeInTheDocument();

      await user.click(row);
      expect(onCompareTopicClick).toHaveBeenCalledWith("doprava");
    });

    it("lists the starred questions with the parties that agreed, and opens the comparison on them", async () => {
      const user = userEvent.setup();
      const { onCompareImportantClick } = renderPage();
      const importantCard = card("Vaše důležité otázky");

      expect(within(importantCard).getByText("Otázka 3")).toBeInTheDocument();
      expect(within(importantCard).getByRole("img", { name: "Ano" })).toBeInTheDocument();
      expect(within(importantCard).getByText("Souhlasí 2 z 5 stran")).toBeInTheDocument();
      // Alfa and Delta stood with the reader; the stack names them for a screen reader.
      expect(within(importantCard).getByRole("button", { name: "Strany, které s vámi souhlasí" })).toBeInTheDocument();

      await user.click(within(importantCard).getByRole("button", { name: "Porovnat důležité otázky" }));
      expect(onCompareImportantClick).toHaveBeenCalledTimes(1);
    });

    it("lists the questions where the reader was outnumbered", () => {
      renderPage();
      const grain = card("Kde jste proti proudu");

      expect(
        within(grain)
          .getAllByRole("listitem")
          .map((item) => item.textContent),
      ).toEqual(["Otázka 6Souhlasí 2 z 6 stran"]);
      expect(within(grain).getByRole("img", { name: "Ano" })).toBeInTheDocument();
      expect(within(grain).queryByText("U žádné otázky jste nezůstali v menšině.")).toBeNull();
    });

    it("assembles the summary from the same numbers the screen shows", () => {
      renderPage();

      expect(prompt().value).toBe(
        [
          "Rozhoduji se ve volbách Sněmovní volby 2025 (Volební kalkulačka). Ve volební kalkulačce mám zodpovězeno 5 ze 6 otázek.",
          "Nejvíc se shoduji s těmito stranami:\n1. Delta — 100\u00a0%\n2. Alfa — 67\u00a0%\n3. Gama — 50\u00a0%",
          "Podle jednotlivých témat mi je nejblíž:\n- Doprava: Delta (100\u00a0%)",
          "Jako důležité mám označené tyto otázky:\n- Tvrzení 3 — souhlasím",
          "U těchto otázek se se mnou shodlo nejmíň stran:\n- Tvrzení 6 — souhlasím (souhlasí 2 z 6 stran)",
          "Vysvětli mi hlavní rozdíly mezi prvními třemi stranami v tomto seznamu a navrhni, na co se jich před volbami zeptat.",
        ].join("\n\n"),
      );
    });

    it("copies the summary and says so", async () => {
      const user = userEvent.setup();
      // After `setup()`: user-event installs a clipboard stub of its own, and this one has to win.
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
      try {
        renderPage();

        await user.click(screen.getByRole("button", { name: "Kopírovat shrnutí" }));
        expect(writeText).toHaveBeenCalledWith(prompt().value);
        expect(screen.getByRole("button", { name: "Zkopírováno" })).toBeInTheDocument();
        expect(screen.getByText("Shrnutí vzniklo tady v prohlížeči z vašich odpovědí. Nikam se neodesílá.")).toBeInTheDocument();
      } finally {
        Reflect.deleteProperty(navigator, "clipboard");
      }
    });
  });

  it("re-reads the answers when the store changes", () => {
    const answersStore = createAnswersStore();
    answersStore.getState().setAnswers(userAnswers);
    window.sessionStorage.setItem(seenKey(calculatorId), "1");

    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
          <AnswersStoreContext.Provider value={answersStore}>
            <ResultPage
              appTitle="Volební kalkulačka"
              calculatorName="Volební kalkulačka"
              onBackClick={vi.fn()}
              onCompareClick={vi.fn()}
              onCompareTopicClick={vi.fn()}
              onCompareImportantClick={vi.fn()}
              onShareClick={vi.fn()}
            />
          </AnswersStoreContext.Provider>
        </CalculatorStoreContext.Provider>
      </LocaleProvider>,
    );
    expect(rows()[0]).toHaveTextContent("Demokratická strana");

    // Flip every answer: Zeta, who said no on the two questions now answered no, is the perfect match.
    act(() => {
      answersStore.getState().setAnswers(userAnswers.map((answer) => (answer.answer === undefined ? answer : { ...answer, answer: !answer.answer })));
    });
    expect(rows()[0]).toHaveTextContent("Zeta");
    fireEvent.click(rowButton("Zeta"));
    expect(rowButton("Zeta")).toHaveAttribute("aria-pressed", "true");
  });
});

describe("sharing", () => {
  /* jsdom doesn't implement `<dialog>`'s `showModal()`/`close()` — the same minimum stub the design system's dialog tests use. */
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  });

  /** Alfa with a logo, so one card row has a picture to route through the app's proxy. */
  const dataWithLogo: CalculatorData = {
    ...calculatorData,
    data: {
      ...calculatorData.data,
      candidates: calculatorData.data.candidates.map((candidate) =>
        candidate.id === ids.alfa ? { ...candidate, images: [{ type: "logo", urls: { original: "images/alfa.png", xs: "images/alfa.xs.webp", md: "images/alfa.md.webp" } }] } : candidate,
      ),
    },
  };

  it("without a share configuration, only tells the app — the page has no dialog of its own to open", async () => {
    const user = userEvent.setup();
    const { onShareClick } = renderPage();
    await user.click(screen.getByRole("button", { name: "Sdílet" }));
    expect(onShareClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("opens the share dialog over the ranking, previewing the top five as they stand on screen", async () => {
    const user = userEvent.setup();
    const assetUrl = vi.fn((url: string) => `/api/assets/${url.split("/").pop()}`);
    const { onShareClick } = renderPage({ data: dataWithLogo, props: { share: { url: "https://example.test/volby/uvod", assetUrl } } });

    // Nothing of the dialog is built until it is asked for.
    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Sdílet" }));
    expect(onShareClick).toHaveBeenCalledTimes(1);
    const dialog = screen.getByRole("dialog", { name: "Sdílet výsledek" });
    expect(dialog).toHaveProperty("open", true);

    // The preview is a picture of *this* ranking: the same five rows and numbers, with the short names the card has room for.
    const preview = dialog.querySelector("[data-format='story']");
    if (!(preview instanceof HTMLElement)) throw new Error("No card in the preview");
    expect(Array.from(preview.querySelectorAll("li")).map(visibleText)).toEqual(["Největší shoda1.Delta100\u00a0%", "2.Alfa67\u00a0%", "3.Gama50\u00a0%", "4.Epsilon50\u00a0%", "5.Beta33\u00a0%"]);
    expect(preview.querySelector("h2")).toHaveTextContent("Moje shoda");
    expect(preview.querySelector("header")).toHaveTextContent("Sněmovní volby Volební kalkulačka 2025");

    // The card's picture goes through the app's proxy — the largest size worth the bytes — while the row on screen keeps the CDN's own set.
    expect(assetUrl).toHaveBeenCalledWith("https://data.kalkulacka.one/kalkulacka/images/alfa.md.webp");
    expect(preview.querySelector("img")).toHaveAttribute("src", "/api/assets/alfa.md.webp");
    expect(within(rowButton("Alfa")).getByRole("presentation")).toHaveAttribute("src", "https://data.kalkulacka.one/kalkulacka/images/alfa.xs.webp");

    // No backend was configured, so no link to copy.
    expect(within(dialog).queryByRole("button", { name: "Kopírovat odkaz" })).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Zavřít" }));
    expect(dialog).toHaveProperty("open", false);
  });

  it("offers the public link once the app says it can mint one", async () => {
    const user = userEvent.setup();
    renderPage({ props: { share: { onRequestShareLink: vi.fn().mockResolvedValue(null) } } });
    await user.click(screen.getByRole("button", { name: "Sdílet" }));
    expect(within(screen.getByRole("dialog", { name: "Sdílet výsledek" })).getByRole("button", { name: "Kopírovat odkaz" })).toBeInTheDocument();
  });
});
