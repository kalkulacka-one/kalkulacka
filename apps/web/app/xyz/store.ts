import { create } from "zustand";
import { Question } from "@repo/schema/dist";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

type QuestionsStore = {
  testQuestions: any[];
  questions: ExtendedQuestions[];
  currentQuestion: number;
  questionTotal: number;
  skipQuestion: () => void;
  prevQuestion: () => void;
  toggleImportant: () => void;
  answerYes: () => void;
  answerNo: () => void;
  setCurrentQuestion: (number: number) => void;
};

export const useQuestionsStore = create<QuestionsStore>((set) => ({
  questions: [],
  testQuestions: [
    {
      id: "b2e48e5f-2a73-498a-8817-3f8c36663984",
      title: "Více míst na gymnáziích",
      statement:
        "Měl by kraj rozšířit kapacitu gymnázií a podpořit všeobecné vzdělávací obory?",
      detail:
        "V ČR studuje na všeobecných oborech 30 % žáků, zatímco v Evropě je tento podíl 50 %. Zastánci chtějí připravit studenty/ky na proměnlivý pracovní trh a zlepšit šance i na další, vyšší vzdělávání, odpůrci argumentují potřebou odborných škol pro naplnění poptávky po specializovaných pracovních místech.",
      tags: ["Vzdělání"],
      isImportant: null,
      answerType: null,
    },
    {
      id: "36079500-1556-4330-81c6-defe94472c99",
      title: "Hromadná doprava vs. automobilová",
      statement:
        "Investice do hromadné dopravy by měly mít přednost před rozvojem infrastruktury pro osobní automobilovou dopravu.",
      detail:
        "Investice do veřejné dopravy jsou klíčové pro všechny kraje, zejména pro venkovské a méně rozvinuté oblasti.",
      tags: ["Veřejná doprava"],
      isImportant: null,
      answerType: null,
    },
    {
      id: "0908ae4c-c4bc-4908-8032-8bc96ae8ca49",
      title: "Podpora obnovitelných zdrojů energie",
      statement:
        "Kraj by měl finančně podporovat budování obnovitelných zdrojů energie na veřejných budovách a pozemcích.",
      detail:
        "Obnovitelné zdroje pomáhají snížit uhlíkovou stopu kraje. Zastánci argumentují, že to přispívá k boji proti změně klimatu, kritici varují před vysokými počátečními investicemi a technickými obtížemi.",
      tags: ["Obnovitelná energie"],
      isImportant: null,
      answerType: null,
    },
    {
      id: "fcdf48ac-3831-4efe-a859-a7a34c446e1c",
      title: "Zákonodárná iniciativa krajů",
      statement: "Kraj by měl častěji využívat svou zákonodárnou iniciativu.",
      detail:
        "Kraje mohou předkládat zákony parlamentu. Zastánci volají po častějším využívání této možnosti, kritici poukazují na nedostatek odborné kapacity pro legislativní práci.",
      tags: ["Legislativní iniciativa"],
      isImportant: null,
      answerType: null,
    },
  ],
  currentQuestion: 0,
  questionTotal: 4,
  skipQuestion: () =>
    set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
  prevQuestion: () =>
    set((state) => ({ currentQuestion: state.currentQuestion - 1 })),
  toggleImportant: () =>
    set((state) => {
      const updatedQuestions = state.questions.map((question, index) => {
        if (index + 1 === state.currentQuestion) {
          return {
            ...question,
            isImportant: !question.isImportant,
          };
        }
        return { ...question };
      });
      return { ...state, questions: updatedQuestions };
    }),
  answerYes: () =>
    set((state) => {
      const updatedQuestions = state.questions.map((question, index) => {
        if (index + 1 === state.currentQuestion) {
          return {
            ...question,
            answerType: true,
          };
        }
        return { ...question };
      });
      return { ...state, questions: updatedQuestions };
    }),
  answerNo: () =>
    set((state) => {
      const updatedQuestions = state.questions.map((question, index) => {
        if (index + 1 === state.currentQuestion) {
          return {
            ...question,
            answerType: false,
          };
        }
        return { ...question };
      });
      return { ...state, questions: updatedQuestions };
    }),
  setCurrentQuestion: (number) => set(() => ({ currentQuestion: number })),
}));

export type { ExtendedQuestions };
