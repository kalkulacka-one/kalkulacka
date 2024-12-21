import { create } from "zustand";

type QuestionsStore = {
  answers: string[];
  currentQuestion: number;
  questionTotal: number;
};

export const useQuestionsStore = create<QuestionsStore>((set) => ({
  answers: ["1", "2", "3"],
  currentQuestion: 1,
  questionTotal: 25,
}));
