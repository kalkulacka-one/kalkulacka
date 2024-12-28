import { create } from "zustand";
import { Question } from "@repo/schema/dist";

type ExtendedQuestions = Question & {
  isImportant: true | false | null;
  answerType: true | false | null;
};

type QuestionsStore = {
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

type GuideStore = {
  guide: { content: string }[];
  currentStep: number;
  stepTotal: number;
  nextStep: () => void;
  prevStep: () => void;
};

export const useGuideStore = create<GuideStore>((set) => ({
  guide: [
    {
      content:
        "Vítejte ve Volební kalkulačce pro krajské volby 2024 pro Jihomoravský kraj. Čeká vás 25 otázek. Stejné otázky dostaly všechny kandidující strany. Zodpovězení otázek zabere zhruba 10 minut a na konci se dozvíte, jak se jednotlivé strany shodují s vašimi názory. Oslovili jsme všechny strany bez výjimky. Pokud se některá neobjeví ve výsledcích, je to proto, že (zatím) neposlala svoje odpovědi.",
    },
    {
      content:
        "Odpovídat můžete pomocí tlačítek: = souhlasím = nesouhlasím. Když se s politikem nebo stranou v odpovědi shodnete, získá ve výpočtu shody 1 bod. V opačném případě 1 bod ztratí. Pokud kandidát nebo strana na otázku neodpověděli, započítá se ziskem 0 bodů.",
    },
    {
      content:
        "Pokud vám na daném tématu zvlášť záleží, označte ho hvězdičkou: = pro mě důležité.  Odpověď pak bude mít ve výpočtu shody dvojnásobnou váhu.",
    },
    {
      content:
        "Když si nejste si jisti, téma Vás nezajímá nebo z jiného důvodu nechcete odpovídat, můžete otázku přeskočit šipkou napravo. Tato otázka se do výpočtu vaší shody nezapočítá.",
    },
  ],
  currentStep: 1,
  stepTotal: 4,
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),
}));

export const useQuestionsStore = create<QuestionsStore>((set) => ({
  questions: [],
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
