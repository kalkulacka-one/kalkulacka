import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AnswerViewModel } from "../../../view-models";
import { QuestionNavigationCard } from "./question-navigation-card";

describe("QuestionNavigationCard", () => {
  const mockAnswerWithResponse: AnswerViewModel = {
    answer: {
      questionId: "550e8400-e29b-41d4-a716-446655440000",
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
    current: 5,
    total: 40,
    onPreviousClick: vi.fn(),
    onNextClick: vi.fn(),
    onAgreeChange: vi.fn(),
    onDisagreeChange: vi.fn(),
    onImportantChange: vi.fn(),
    answer: mockAnswerNoResponse,
  } as const;

  describe("rendering", () => {
    it("renders question counter", () => {
      render(<QuestionNavigationCard {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("/ 40")).toBeInTheDocument();
    });

    it("renders navigation buttons", () => {
      render(<QuestionNavigationCard {...defaultProps} />);

      expect(screen.getByText("Előző")).toBeInTheDocument();
      expect(screen.getByText("Kihagyás")).toBeInTheDocument();
    });

    it("shows 'Következő' when answer is provided", () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} />);
      expect(screen.getByText("Következő")).toBeInTheDocument();
    });

    it("shows 'Útmutató' for first question", () => {
      render(<QuestionNavigationCard {...defaultProps} current={1} />);
      expect(screen.getByText("Útmutató")).toBeInTheDocument();
      expect(screen.queryByText("Előző")).not.toBeInTheDocument();
    });

    it("renders answer buttons", () => {
      render(<QuestionNavigationCard {...defaultProps} />);

      expect(screen.getByText("Egyetértek")).toBeInTheDocument();
      expect(screen.getByText("Nem értek egyet")).toBeInTheDocument();
    });

    it("renders important button", () => {
      render(<QuestionNavigationCard {...defaultProps} />);
      expect(screen.getByLabelText("Számomra fontos")).toBeInTheDocument();
    });

    it("shows correct state when answer is provided", () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} />);

      expect(screen.getByText("Egyetértek")).toBeChecked();
      expect(screen.getByText("Nem értek egyet")).not.toBeChecked();
      expect(screen.getByLabelText("Számomra fontos")).toBeChecked();
    });
  });

  describe("interactions", () => {
    let user: ReturnType<typeof userEvent.setup>;
    let mockHandler: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      user = userEvent.setup();
      mockHandler = vi.fn();
    });

    it("calls onPreviousClick when previous button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onPreviousClick={mockHandler} />);
      await user.click(screen.getByText("Előző"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onPreviousClick when 'Útmutató' button is clicked on first question", async () => {
      render(<QuestionNavigationCard {...defaultProps} current={1} onPreviousClick={mockHandler} />);
      await user.click(screen.getByText("Útmutató"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when next button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onNextClick={mockHandler} />);
      await user.click(screen.getByText("Kihagyás")); // No answer, so shows "Kihagyás"
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onNextClick when 'Következő' button is clicked with answer", async () => {
      render(<QuestionNavigationCard {...defaultProps} answer={mockAnswerWithResponse} onNextClick={mockHandler} />);
      await user.click(screen.getByText("Következő"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onAgreeChange when agree button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onAgreeChange={mockHandler} />);
      await user.click(screen.getByText("Egyetértek"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onDisagreeChange when disagree button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onDisagreeChange={mockHandler} />);
      await user.click(screen.getByText("Nem értek egyet"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    it("calls onImportantChange when important button is clicked", async () => {
      render(<QuestionNavigationCard {...defaultProps} onImportantChange={mockHandler} />);
      await user.click(screen.getByLabelText("Számomra fontos"));
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
