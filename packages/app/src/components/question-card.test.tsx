import type { Question } from "@kalkulacka-one/schema";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { csMessages } from "@/locales";
import type { AnswerViewModel } from "@/view-models/answer";

import { LocaleProvider } from "./providers";
import { QuestionCard } from "./question-card";

describe("QuestionCard", () => {
  const mockQuestion: Question = {
    id: "1",
    title: "Test Question Title",
    statement: "Test Question Statement",
    detail: "Test Question Detail",
    tags: ["Test tag", "Another tag"],
  };

  const mockAnswerWithResponse: AnswerViewModel = {
    answer: {
      questionId: "1",
      answer: true,
      isImportant: true,
    },
    setAnswer: vi.fn(),
  };

  const mockAnswerNoResponse: AnswerViewModel = {
    answer: undefined,
    setAnswer: vi.fn(),
  };

  const defaultProps = {
    question: mockQuestion,
    answer: mockAnswerNoResponse,
    onAgreeChange: vi.fn(),
    onDisagreeChange: vi.fn(),
    onImportantChange: vi.fn(),
  };

  const renderCard = (props: Partial<typeof defaultProps> = {}) =>
    render(
      <LocaleProvider locale="cs" messages={csMessages}>
        <QuestionCard {...defaultProps} {...props} />
      </LocaleProvider>,
    );

  describe("rendering", () => {
    it("renders the category chip from the first tag and the title chip", () => {
      renderCard();
      expect(screen.getByText("Test tag")).toBeInTheDocument();
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    });

    it("renders the statement and detail", () => {
      renderCard();
      expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
      expect(screen.getByText(mockQuestion.detail as string)).toBeInTheDocument();
    });

    it("omits the category chip when the question has no tags", () => {
      renderCard({ question: { ...mockQuestion, tags: undefined } });
      expect(screen.queryByText("Test tag")).not.toBeInTheDocument();
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    });

    it("renders the answer row", () => {
      renderCard();
      expect(screen.getByRole("switch", { name: "Ano" })).toBeInTheDocument();
      expect(screen.getByRole("switch", { name: "Ne" })).toBeInTheDocument();
      expect(screen.getByRole("switch", { name: "Pro mě důležité" })).toBeInTheDocument();
    });

    it("reflects the current answer", () => {
      renderCard({ answer: mockAnswerWithResponse });
      expect(screen.getByRole("switch", { name: "Ano" })).toBeChecked();
      expect(screen.getByRole("switch", { name: "Ne" })).not.toBeChecked();
      expect(screen.getByRole("switch", { name: "Pro mě důležité" })).toBeChecked();
    });
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
      user = userEvent.setup();
    });

    it("calls onAgreeChange when the agree control is clicked", async () => {
      const onAgreeChange = vi.fn();
      renderCard({ onAgreeChange });
      await user.click(screen.getByRole("switch", { name: "Ano" }));
      expect(onAgreeChange).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when the disagree control is clicked", async () => {
      const onDisagreeChange = vi.fn();
      renderCard({ onDisagreeChange });
      await user.click(screen.getByRole("switch", { name: "Ne" }));
      expect(onDisagreeChange).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when the star control is clicked", async () => {
      const onImportantChange = vi.fn();
      renderCard({ onImportantChange });
      await user.click(screen.getByRole("switch", { name: "Pro mě důležité" }));
      expect(onImportantChange).toHaveBeenCalledTimes(1);
    });
  });
});
