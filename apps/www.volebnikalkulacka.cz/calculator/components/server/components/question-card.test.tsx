import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Question } from "../../../../../../packages/schema/schemas/question.schema";
import { QuestionCard } from "./question-card";

describe("QuestionCard", () => {
  const mockQuestion: Question = {
    id: "1",
    title: "Test Question Title",
    statement: "Test Question Statement",
    detail: "Test Question Detail",
    tags: ["Test tag", "Another tag"],
  };

  const props = {
    current: 1,
    total: 10,
    question: mockQuestion,
  };

  it("should render the question card", () => {
    render(<QuestionCard {...props} />);

    expect(screen.getByText(`${props.current}/${props.total}`)).toBeInTheDocument();
    expect(screen.getByText(props.question.title)).toBeInTheDocument();
    expect(screen.getByText(props.question.statement)).toBeInTheDocument();
    if (props.question.detail) {
      expect(screen.getByText(props.question.detail)).toBeInTheDocument();
    }
    if (props.question.tags) {
      for (const tag of props.question.tags) {
        expect(screen.getByText(tag)).toBeInTheDocument();
      }
    }
  });
});
