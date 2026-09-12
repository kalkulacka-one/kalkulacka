import type { Question } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import type { CandidateViewModel } from "@/view-models/candidate";

import { type AiPromptLabels, buildAiPrompt } from "./ai-prompt";
import type { QuestionConsensus, TopicMatch } from "./insights";

/* The Czech catalog's sentences, as the dashboard hands them over. */
const labels: AiPromptLabels = {
  intro: ({ election, district, answered, total }) => `Rozhoduji se ve volbách ${election} (${district}). Ve volební kalkulačce mám zodpovězeno ${answered} ze ${total} otázek.`,
  matches: "Nejvíc se shoduji s těmito stranami:",
  topics: "Podle jednotlivých témat mi je nejblíž:",
  important: "Jako důležité mám označené tyto otázky:",
  grain: "U těchto otázek se se mnou shodlo nejmíň stran:",
  ask: "Vysvětli mi hlavní rozdíly mezi prvními třemi stranami v tomto seznamu a navrhni, na co se jich před volbami zeptat.",
  agree: "souhlasím",
  disagree: "nesouhlasím",
  neutral: "nevím",
  agreeCount: ({ agreeing, responded }) => `Souhlasí ${agreeing} z ${responded} stran`,
  percent: (value) => `${Math.round(value)} %`,
  locale: "cs",
};

const candidate = (id: string, displayName: string): CandidateViewModel => ({ id, displayName, references: [] });
const question = (id: string, statement: string): Question => ({ id, title: statement, statement });

const alfa = candidate("alfa", "Alfa");
const beta = candidate("beta", "Beta");
const gama = candidate("gama", "Gama");
const delta = candidate("delta", "Delta");

const consensus = (id: string, statement: string, userAnswer: boolean | null, agreeing: CandidateViewModel[], respondedCount: number): QuestionConsensus => ({
  question: question(id, statement),
  userAnswer,
  important: false,
  agreeing,
  opposing: [],
  respondedCount,
});

const topic = (name: string, best: CandidateViewModel, matchPercentage: number): TopicMatch => ({ topic: name, questionCount: 4, answeredCount: 3, best: { candidate: best, matchPercentage } });

const base = {
  electionName: "Sněmovní volby 2025",
  districtName: "Volební kalkulačka",
  answered: 30,
  total: 42,
};

describe("buildAiPrompt", () => {
  it("opens with where the reader is and how much they answered, and ends with the question to ask", () => {
    const prompt = buildAiPrompt({ ...base, matches: [], topics: [], important: [], againstTheGrain: [] }, labels);

    expect(prompt).toBe(["Rozhoduji se ve volbách Sněmovní volby 2025 (Volební kalkulačka). Ve volební kalkulačce mám zodpovězeno 30 ze 42 otázek.", labels.ask].join("\n\n"));
  });

  it("names the top three comparable parties, numbered, and skips a party that never answered", () => {
    const matches = [
      { candidate: alfa, match: 81.4 },
      { candidate: { displayName: undefined }, match: undefined },
      { candidate: beta, match: 63 },
      { candidate: gama, match: 55.5 },
      { candidate: delta, match: 40 },
    ];
    const prompt = buildAiPrompt({ ...base, matches, topics: [], important: [], againstTheGrain: [] }, labels);

    expect(prompt).toContain(["Nejvíc se shoduji s těmito stranami:", "1. Alfa — 81 %", "2. Beta — 63 %", "3. Gama — 56 %"].join("\n"));
    expect(prompt).not.toContain("Delta");
  });

  it("lists the closest party per topic", () => {
    const prompt = buildAiPrompt({ ...base, matches: [], topics: [topic("Doprava", alfa, 100), topic("Školství", beta, 66.7)], important: [], againstTheGrain: [] }, labels);

    expect(prompt).toContain(["Podle jednotlivých témat mi je nejblíž:", "- Doprava: Alfa (100 %)", "- Školství: Beta (67 %)"].join("\n"));
  });

  it("lists the starred questions with the reader's own position", () => {
    const important = [consensus("q1", "Praha má zavést mýto.", true, [alfa], 3), consensus("q2", "Daně mají klesnout.", false, [], 3), consensus("q3", "Stát má stavět byty.", null, [], 3)];
    const prompt = buildAiPrompt({ ...base, matches: [], topics: [], important, againstTheGrain: [] }, labels);

    expect(prompt).toContain(["Jako důležité mám označené tyto otázky:", "- Praha má zavést mýto. — souhlasím", "- Daně mají klesnout. — nesouhlasím", "- Stát má stavět byty. — nevím"].join("\n"));
  });

  it("lists the minority questions with how much company the reader had, lowercased into the parenthesis", () => {
    const againstTheGrain = [consensus("q1", "Praha má zavést mýto.", true, [alfa], 8)];
    const prompt = buildAiPrompt({ ...base, matches: [], topics: [], important: [], againstTheGrain }, labels);

    expect(prompt).toContain(["U těchto otázek se se mnou shodlo nejmíň stran:", "- Praha má zavést mýto. — souhlasím (souhlasí 1 z 8 stran)"].join("\n"));
  });

  it("separates the sections with a blank line, in reading order, leaving empty ones out", () => {
    const prompt = buildAiPrompt({ ...base, matches: [{ candidate: alfa, match: 81 }], topics: [], important: [], againstTheGrain: [consensus("q1", "Tvrzení.", false, [], 2)] }, labels);
    const sections = prompt.split("\n\n");

    expect(sections).toHaveLength(4);
    expect(sections[0]).toMatch(/^Rozhoduji se/);
    expect(sections[1]).toMatch(/^Nejvíc se shoduji/);
    expect(sections[2]).toMatch(/^U těchto otázek/);
    expect(sections[3]).toBe(labels.ask);
  });
});
