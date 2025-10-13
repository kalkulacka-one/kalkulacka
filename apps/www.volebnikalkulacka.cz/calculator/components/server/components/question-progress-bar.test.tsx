import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Answer } from "../../../../../../packages/schema/schemas/answer.schema";
import type { Question } from "../../../../../../packages/schema/schemas/question.schema";
import { answersViewModel, questionsViewModel } from "../../../view-models/";
import { QuestionProgressBar } from "./question-progress-bar";

describe("QuestionProgressBar", () => {
  const mockQuestions: Question[] = [
    {
      id: "1",
      title: "Question 1",
      statement: "Statement 1",
      detail: "Detail 1",
      tags: [],
    },
    {
      id: "2",
      title: "Question 2",
      statement: "Statement 2",
      detail: "Detail 2",
      tags: [],
    },
    {
      id: "3",
      title: "Question 3",
      statement: "Statement 3",
      detail: "Detail 3",
      tags: [],
    },
  ];

  const mockAnswers: Answer[] = [
    {
      questionId: "1",
      answer: true,
      isImportant: false,
    },
    {
      questionId: "2",
      answer: false,
      isImportant: true,
    },
  ];

  const mockSetAnswer = () => {};
  const mockClearAnswers = () => {};

  const props = {
    questions: questionsViewModel(mockQuestions),
    answers: answersViewModel(mockAnswers, mockSetAnswer, mockClearAnswers),
    current: 2,
  };

  it("should render the progress bar", () => {
    render(<QuestionProgressBar {...props} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuetext", "Question 2 of 3");
    expect(progressBar).toHaveAttribute("aria-valuenow", "2");
    expect(progressBar).toHaveAttribute("aria-valuemin", "1");
    expect(progressBar).toHaveAttribute("aria-valuemax", "3");
  });

  it("should render correct number of step items", () => {
    const { container } = render(<QuestionProgressBar {...props} />);

    const stepItems = container.querySelectorAll('[role="progressbar"] > div');
    expect(stepItems).toHaveLength(3);
  });

  it("should handle empty questions", () => {
    const emptyProps = {
      ...props,
      questions: questionsViewModel([]),
    };

    const { container } = render(<QuestionProgressBar {...emptyProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle questions without answers", () => {
    const noAnswersProps = {
      ...props,
      answers: answersViewModel([], mockSetAnswer, mockClearAnswers),
    };

    render(<QuestionProgressBar {...noAnswersProps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });
});
