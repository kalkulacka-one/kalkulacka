import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { QuestionViewModel } from "../../../view-models/question";
import { QuestionCard } from "./question-card";

describe("QuestionCard", () => {
  const questionCurrent = 1;
  const questionTotal = 10;
  it("should render the question card with required props", () => {
    const mockQuestion: QuestionViewModel = {
      id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Test Question Title",
      statement: "Test Question Statement",
    };

    render(<QuestionCard question={mockQuestion} questionCurrent={questionCurrent} questionTotal={questionTotal} />);

    expect(screen.getByText(`${questionCurrent}/${questionTotal}`)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
  });
  it("should render the question card with all props", () => {
    const mockQuestion: QuestionViewModel = {
      id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Test Question Title",
      statement: "Test Question Statement",
      detail: "Test Question Detail",
      tags: ["Test tag"],
    };

    render(<QuestionCard question={mockQuestion} questionCurrent={questionCurrent} questionTotal={questionTotal} />);

    expect(screen.getByText(`${questionCurrent}/${questionTotal}`)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(mockQuestion.statement)).toBeInTheDocument();
    expect(screen.queryByText(mockQuestion.detail ?? "")).toBeInTheDocument();
    if (mockQuestion.tags) {
      for (const tag of mockQuestion.tags) {
        expect(screen.getByText(tag)).toBeInTheDocument();
      }
    }
  });
});
