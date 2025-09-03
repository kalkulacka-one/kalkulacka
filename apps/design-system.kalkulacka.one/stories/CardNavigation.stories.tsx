import { CardNavigation } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof CardNavigation> = {
  title: "Components/CardNavigation",
  component: CardNavigation,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    children: {
      control: false,
    },
    previous: {
      control: "object",
    },
    next: {
      control: "object",
    },
    className: {
      control: "text",
    },
  },
};

type CardNavigationStory = StoryObj<typeof meta>;

const InteractiveExample = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 5;

  const questions = [
    { title: "Question 1", content: "Do you support renewable energy initiatives?" },
    { title: "Question 2", content: "Should public transportation be free?" },
    { title: "Question 3", content: "Do you agree with increasing minimum wage?" },
    { title: "Question 4", content: "Should education be more accessible?" },
    { title: "Question 5", content: "Do you support universal healthcare?" },
  ];

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const current = questions[currentQuestion - 1];

  if (!current) {
    return null;
  }

  return (
    <CardNavigation
      previous={
        currentQuestion > 1
          ? {
              onClick: handlePrevious,
              label: "Previous Question",
              shortLabel: "Previous",
              disabled: false,
            }
          : {
              onClick: handlePrevious,
              label: "Previous Question",
              shortLabel: "Previous",
              disabled: true,
            }
      }
      next={
        currentQuestion < totalQuestions
          ? {
              onClick: handleNext,
              label: "Next Question",
              shortLabel: "Next",
              disabled: false,
            }
          : {
              onClick: handleNext,
              label: "Next Question",
              shortLabel: "Next",
              disabled: true,
            }
      }
    >
      <Card>
        <div className="ko:p-8">
          <div className="ko:flex ko:justify-between ko:items-center ko:mb-4">
            <h2 className="ko:text-2xl ko:font-bold">{current.title}</h2>
            <span className="ko:text-sm ko:text-gray-500">
              {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <p className="ko:text-lg ko:leading-relaxed ko:mb-6">{current.content}</p>
          <div className="ko:flex ko:gap-2">
            <button type="button" className="ko:px-4 ko:py-2 ko:border ko:border-gray-300 ko:rounded">
              Yes
            </button>
            <button type="button" className="ko:px-4 ko:py-2 ko:border ko:border-gray-300 ko:rounded">
              No
            </button>
            <button type="button" className="ko:px-4 ko:py-2 ko:border ko:border-gray-300 ko:rounded">
              Not sure
            </button>
          </div>
        </div>
      </Card>
    </CardNavigation>
  );
};

export const Interactive: CardNavigationStory = {
  render: () => <InteractiveExample />,
  parameters: {
    docs: {
      description: {
        story: "Interactive navigation example with regular text size. Click Previous and Next to navigate through questions.",
      },
    },
  },
};

const LargeTextExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const pages = [
    {
      title: "The Grand Philosophy of Modern Computing",
      content: "In the vast expanse of technological evolution, we find ourselves at a crossroads where quantum mechanics meets classical computing paradigms.",
      additionalText: "This revolutionary approach challenges our fundamental understanding of what it means to process information in the digital age.",
    },
    {
      title: "Exploring Multidimensional Data Structures",
      content: "When considering the implementation of n-dimensional arrays in memory-constrained environments, one must carefully balance theoretical elegance with practical efficiency.",
      additionalText: "The implications for machine learning algorithms and artificial intelligence systems cannot be overstated.",
    },
    {
      title: "The Zen of Asynchronous Programming",
      content: "Promises, callbacks, and async/await patterns represent more than mere syntactic sugar—they embody a philosophical shift in how we conceptualize program flow.",
      additionalText: "Understanding these patterns deeply transforms one from a mere coder into a true software architect.",
    },
  ];

  const handleSkipToFirst = () => setCurrentPage(1);
  const handleSkipToLast = () => setCurrentPage(totalPages);
  const handlePrevious = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNext = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  const current = pages[currentPage - 1];

  if (!current) {
    return null;
  }

  return (
    <CardNavigation
      previous={
        currentPage === 1
          ? {
              onClick: handleSkipToFirst,
              label: "Already at First Page",
              shortLabel: "First",
              icon: "doubleChevron",
              disabled: true,
            }
          : currentPage === 2
            ? {
                onClick: handlePrevious,
                label: "Go to Previous Page",
                shortLabel: "Previous",
              }
            : {
                onClick: handleSkipToFirst,
                label: "Skip to Beginning",
                shortLabel: "First",
                icon: "doubleChevron",
              }
      }
      next={
        currentPage === totalPages
          ? {
              onClick: handleSkipToLast,
              label: "Already at Last Page",
              shortLabel: "Last",
              icon: "doubleChevron",
              disabled: true,
            }
          : currentPage === totalPages - 1
            ? {
                onClick: handleNext,
                label: "Go to Next Page",
                shortLabel: "Next",
              }
            : {
                onClick: handleSkipToLast,
                label: "Skip to End",
                shortLabel: "Last",
                icon: "doubleChevron",
              }
      }
    >
      <Card>
        <div className="ko:p-12">
          <div className="ko:text-xs ko:text-gray-400 ko:uppercase ko:tracking-wider ko:mb-2">
            Page {currentPage} of {totalPages}
          </div>
          <h1 className="ko:text-5xl ko:font-black ko:mb-8 ko:leading-tight">{current.title}</h1>
          <p className="ko:text-2xl ko:leading-relaxed ko:mb-6 ko:font-light">{current.content}</p>
          <p className="ko:text-xl ko:leading-relaxed ko:text-gray-600 ko:italic">{current.additionalText}</p>
          <div className="ko:mt-12 ko:pt-8 ko:border-t ko:border-gray-200">
            <p className="ko:text-sm ko:text-gray-500">Navigation tip: Use single chevrons to go page by page, or double chevrons to skip to first/last when available.</p>
          </div>
        </div>
      </Card>
    </CardNavigation>
  );
};

export const LargeTextVariations: CardNavigationStory = {
  render: () => <LargeTextExample />,
  parameters: {
    docs: {
      description: {
        story: "Example with large and varied text sizes, demonstrating how the navigation adapts to different content heights. Also shows double chevron icons for skip navigation.",
      },
    },
  },
};

export default meta;
