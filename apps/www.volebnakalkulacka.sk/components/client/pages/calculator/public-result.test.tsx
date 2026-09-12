import { type CalculatorData, type calculateMatches, ResultPage } from "@kalkulacka-one/app";
import { AnswersStoreContext, CalculatorStoreContext, createAnswersStore, createCalculatorStore } from "@kalkulacka-one/app/client";
import type { Answer } from "@kalkulacka-one/schema";

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CalculatorMenu } from "@/components/client";

import { PublicResultPageWithData } from "./public-result";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "sk",
  hasLocale: (locales: readonly string[], locale: string) => locales.includes(locale),
}));

vi.mock("@/components/client", () => ({
  CalculatorMenu: vi.fn(() => null),
}));

/*
 * The page itself is the app package's business. What matters here is what
 * it is handed — and which answers store it finds nearest, so the mock reads
 * that store the way the real page does and writes it out.
 */
vi.mock("@kalkulacka-one/app", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@kalkulacka-one/app")>();
  const { useAnswersStore } = await import("@kalkulacka-one/app/client");
  return {
    ...actual,
    ResultPage: vi.fn(() => {
      const answers = useAnswersStore((state) => state.answers);
      return <output data-testid="answers">{JSON.stringify(answers)}</output>;
    }),
  };
});

const calculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "00000000-0000-4000-8000-000000000000",
      createdAt: new Date(0).toISOString(),
      // A standalone calculator, named by its own data rather than by a config.
      key: "inventura-2023-2025",
      title: "Inventúra hlasovaní Národnej rady Slovenskej republiky 2023-2025",
      shortTitle: "Inventúra 2023-2025",
    },
    questions: [],
    candidates: [],
    candidatesAnswers: {},
  },
  baseUrl: "https://data.kalkulacka.one/www.volebnakalkulacka.sk/inventura-2023-2025",
};

const segments = { first: "inventura-2023-2025" };

const answers: Answer[] = [
  { questionId: "22222222-2222-4222-8222-222222222222", answer: true },
  { questionId: "33333333-3333-4333-8333-333333333333", answer: false, isImportant: true },
];

const algorithmMatches: ReturnType<typeof calculateMatches> = [
  { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", match: 80 },
  { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", match: 20 },
];

function renderPage() {
  // The route's own store, the one every other screen reads — empty, as it is on a public route with no session.
  const routeStore = createAnswersStore();

  render(
    <CalculatorStoreContext.Provider value={createCalculatorStore(calculatorData)}>
      <AnswersStoreContext.Provider value={routeStore}>
        <PublicResultPageWithData algorithmMatches={algorithmMatches} answers={answers} segments={segments} />
      </AnswersStoreContext.Provider>
    </CalculatorStoreContext.Provider>,
  );

  const props = vi.mocked(ResultPage).mock.lastCall?.[0];
  if (!props) throw new Error("ResultPage was not rendered");
  return { props, routeStore };
}

describe("PublicResultPageWithData", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the results screen read-only, replaying the stored ranking under the data's own name", () => {
    const { props } = renderPage();

    expect(props).toEqual(
      expect.objectContaining({
        appTitle: "Volebná kalkulačka",
        calculatorName: "Inventúra hlasovaní Národnej rady Slovenskej republiky 2023-2025",
        shared: true,
        algorithmMatches,
      }),
    );
    // A standalone calculator belongs to no election.
    expect(props.electionName).toBeUndefined();
    // Nothing that would act on the viewer's own result.
    expect(props.share).toBeUndefined();
    expect(props.onShareClick).toBeUndefined();
    expect(props.onCompareClick).toBeUndefined();
    expect(props.onCompareTopicClick).toBeUndefined();
    expect(props.onCompareImportantClick).toBeUndefined();
    expect(props.donateCard).toBeUndefined();
  });

  it("puts the read-only menu in the header", () => {
    const { props } = renderPage();
    const menu = props.headerActions;

    if (!menu || typeof menu !== "object" || !("type" in menu)) throw new Error("No element in the header");
    expect(menu.type).toBe(CalculatorMenu);
    expect(menu.props).toEqual({ segments, readOnly: true });
  });

  it("hands the page a store of its own, seeded with the shared answers, and leaves the route's store alone", () => {
    const { routeStore } = renderPage();

    expect(JSON.parse(screen.getByTestId("answers").textContent ?? "")).toEqual(answers);
    expect(routeStore.getState().answers).toEqual([]);
  });

  it("sends the visitor to the calculator's intro for their own calculator, and from the empty state's exit too", () => {
    const { props } = renderPage();

    props.onStartOwnClick?.();
    props.onBackClick();
    expect(push).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenNthCalledWith(1, "/inventura-2023-2025/uvod");
    expect(push).toHaveBeenNthCalledWith(2, "/inventura-2023-2025/uvod");
  });
});
