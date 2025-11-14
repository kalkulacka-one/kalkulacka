import type { CalculatorData } from "../../calculator/lib/data-fetching/load-calculator-data";

/**
 * Mock calculator data for testing routing
 * Based on the schema from @repo/schema and real data structure
 */

// Question UUIDs for consistency
const questionIds = [
  "q1111111-1111-1111-1111-111111111111",
  "q2222222-2222-2222-2222-222222222222",
  "q3333333-3333-3333-3333-333333333333",
  "q4444444-4444-4444-4444-444444444444",
  "q5555555-5555-5555-5555-555555555555",
];

// Candidate UUIDs for consistency
const candidateIds = ["c1111111-1111-1111-1111-111111111111", "c2222222-2222-2222-2222-222222222222", "c3333333-3333-3333-3333-333333333333"];

/**
 * Mock calculator data for one-segment route (e.g., /volby/snemovni-2025/kalkulacka)
 */
export const mockOneSegmentCalculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      publishedAt: "2024-01-15T10:30:00Z",
      title: "Sněmovní volby 2025",
      description: "Volební kalkulačka pro sněmovní volby 2025",
      key: "snemovni-2025",
      shortTitle: "Sněmovní volby 2025",
      intro: "Vítejte ve volební kalkulačce pro sněmovní volby 2025",
      methodology: "Metodika této kalkulačky je založena na...",
    },
    questions: [
      {
        id: questionIds[0],
        title: "Otázka 1",
        statement: "České školství potřebuje zásadní reformu",
        detail: "Detailní popis první otázky...",
      },
      {
        id: questionIds[1],
        title: "Otázka 2",
        statement: "Česko by mělo investovat více do obnovitelných zdrojů energie",
        detail: "Detailní popis druhé otázky...",
      },
      {
        id: questionIds[2],
        title: "Otázka 3",
        statement: "Daně pro bohaté by měly být zvýšeny",
        detail: "Detailní popis třetí otázky...",
      },
      {
        id: questionIds[3],
        title: "Otázka 4",
        statement: "Česko by mělo přijmout euro jako svou měnu",
        detail: "Detailní popis čtvrté otázky...",
      },
      {
        id: questionIds[4],
        title: "Otázka 5",
        statement: "Minimální mzda by měla být výrazně zvýšena",
        detail: "Detailní popis páté otázky...",
      },
    ],
    candidates: [
      {
        id: candidateIds[0],
        displayName: "Strana A",
        references: [
          {
            id: "p1111111-1111-1111-1111-111111111111",
            type: "organization" as const,
          },
        ],
        number: 1,
      },
      {
        id: candidateIds[1],
        displayName: "Strana B",
        references: [
          {
            id: "p2222222-2222-2222-2222-222222222222",
            type: "organization" as const,
          },
        ],
        number: 2,
      },
      {
        id: candidateIds[2],
        displayName: "Strana C",
        references: [
          {
            id: "p3333333-3333-3333-3333-333333333333",
            type: "organization" as const,
          },
        ],
        number: 3,
      },
    ],
    candidatesAnswers: {
      [candidateIds[0]]: [
        { questionId: questionIds[0], answer: true, respondent: "candidate" },
        { questionId: questionIds[1], answer: true, respondent: "candidate" },
        { questionId: questionIds[2], answer: false, respondent: "candidate" },
        { questionId: questionIds[3], answer: null, respondent: "candidate" },
        { questionId: questionIds[4], answer: true, respondent: "candidate" },
      ],
      [candidateIds[1]]: [
        { questionId: questionIds[0], answer: false, respondent: "candidate" },
        { questionId: questionIds[1], answer: true, respondent: "candidate" },
        { questionId: questionIds[2], answer: true, respondent: "candidate" },
        { questionId: questionIds[3], answer: false, respondent: "candidate" },
        { questionId: questionIds[4], answer: null, respondent: "candidate" },
      ],
      [candidateIds[2]]: [
        { questionId: questionIds[0], answer: null, respondent: "candidate" },
        { questionId: questionIds[1], answer: false, respondent: "candidate" },
        { questionId: questionIds[2], answer: true, respondent: "candidate" },
        { questionId: questionIds[3], answer: true, respondent: "candidate" },
        { questionId: questionIds[4], answer: false, respondent: "candidate" },
      ],
    },
  },
  baseUrl: "https://data.kalkulacka.one/snemovni-2025",
};

/**
 * Mock calculator data for two-segment route (e.g., /volby/krajske-2024/jihomoravsky)
 */
export const mockTwoSegmentCalculatorData: CalculatorData = {
  data: {
    calculator: {
      id: "987e6543-e21c-34d5-a678-426614174000",
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-08-15T10:00:00Z",
      publishedAt: "2024-08-15T10:30:00Z",
      title: "Krajské volby 2024 - Jihomoravský kraj",
      description: "Volební kalkulačka pro krajské volby 2024 v Jihomoravském kraji",
      calculatorGroup: {
        id: "group111-1111-1111-1111-111111111111",
        key: "krajske-2024",
      },
      variant: {
        key: "jihomoravsky",
      },
      shortTitle: "Krajské volby JmK",
      intro: "Vítejte ve volební kalkulačce pro krajské volby 2024 v Jihomoravském kraji",
      methodology: "Metodika této kalkulačky je založena na...",
    },
    questions: [
      {
        id: questionIds[0],
        title: "Otázka 1",
        statement: "Kraj by měl více investovat do veřejné dopravy",
        detail: "Detailní popis první otázky...",
      },
      {
        id: questionIds[1],
        title: "Otázka 2",
        statement: "Podpora kulturních akcí by měla být navýšena",
        detail: "Detailní popis druhé otázky...",
      },
      {
        id: questionIds[2],
        title: "Otázka 3",
        statement: "Kraj by měl stavět více cyklostezek",
        detail: "Detailní popis třetí otázky...",
      },
      {
        id: questionIds[3],
        title: "Otázka 4",
        statement: "Investice do zdravotnictví jsou prioritou",
        detail: "Detailní popis čtvrté otázky...",
      },
      {
        id: questionIds[4],
        title: "Otázka 5",
        statement: "Kraj by měl podporovat místní podnikatele",
        detail: "Detailní popis páté otázky...",
      },
    ],
    candidates: [
      {
        id: candidateIds[0],
        displayName: "Kandidát JmK A",
        references: [
          {
            id: "p4444444-4444-4444-4444-444444444444",
            type: "person" as const,
          },
        ],
        number: 1,
      },
      {
        id: candidateIds[1],
        displayName: "Kandidát JmK B",
        references: [
          {
            id: "p5555555-5555-5555-5555-555555555555",
            type: "person" as const,
          },
        ],
        number: 2,
      },
      {
        id: candidateIds[2],
        displayName: "Kandidát JmK C",
        references: [
          {
            id: "p6666666-6666-6666-6666-666666666666",
            type: "person" as const,
          },
        ],
        number: 3,
      },
    ],
    candidatesAnswers: {
      [candidateIds[0]]: [
        { questionId: questionIds[0], answer: true, respondent: "candidate" },
        { questionId: questionIds[1], answer: false, respondent: "candidate" },
        { questionId: questionIds[2], answer: true, respondent: "candidate" },
        { questionId: questionIds[3], answer: true, respondent: "candidate" },
        { questionId: questionIds[4], answer: null, respondent: "candidate" },
      ],
      [candidateIds[1]]: [
        { questionId: questionIds[0], answer: null, respondent: "candidate" },
        { questionId: questionIds[1], answer: true, respondent: "candidate" },
        { questionId: questionIds[2], answer: false, respondent: "candidate" },
        { questionId: questionIds[3], answer: true, respondent: "candidate" },
        { questionId: questionIds[4], answer: true, respondent: "candidate" },
      ],
      [candidateIds[2]]: [
        { questionId: questionIds[0], answer: false, respondent: "candidate" },
        { questionId: questionIds[1], answer: true, respondent: "candidate" },
        { questionId: questionIds[2], answer: true, respondent: "candidate" },
        { questionId: questionIds[3], answer: null, respondent: "candidate" },
        { questionId: questionIds[4], answer: false, respondent: "candidate" },
      ],
    },
  },
  baseUrl: "https://data.kalkulacka.one/krajske-2024/jihomoravsky",
};

/**
 * Helper to get mock data based on route parameters
 */
export function getMockCalculatorData({ key: _key, group }: { key: string; group?: string }): CalculatorData {
  if (group) {
    return mockTwoSegmentCalculatorData;
  }
  return mockOneSegmentCalculatorData;
}

/**
 * Mock public ID for testing shared results
 */
export const MOCK_PUBLIC_ID = "abc123def456";

/**
 * Mock embed name for testing embed routes
 */
export const MOCK_EMBED_NAME = "test-embed";
