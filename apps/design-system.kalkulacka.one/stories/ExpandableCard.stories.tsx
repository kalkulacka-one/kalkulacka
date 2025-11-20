import { ExpandableCard } from "@kalkulacka-one/design-system/client";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ExpandableCard> = {
  title: "Components/ExpandableCard",
  component: ExpandableCard,
  tags: ["autodocs"],
  args: {
    defaultOpen: false,
    color: "white",
    corner: "topLeft",
    border: false,
    shadow: false,
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Default expanded state",
    },
    color: {
      control: "select",
      options: ["white", "transparent"],
    },
    corner: {
      control: "select",
      options: ["topRight", "topLeft", "bottomRight", "bottomLeft"],
    },
    border: {
      control: "boolean",
    },
    shadow: {
      control: "select",
      options: [true, "hard", false],
    },
    children: {
      control: false,
    },
  },
};

export default meta;

type ExpandableCardStory = StoryObj<typeof meta>;

export const Default: ExpandableCardStory = {
  name: "Default expandable card",
  args: {
    shadow: "hard",
    border: true,
  },
  render: (args) => (
    <ExpandableCard {...args}>
      {({ open }) => (
        <>
          <ExpandableCard.Content>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Card Title</h3>
                <ExpandableCard.Chevron open={open} />
              </div>
              <p className="text-gray-600">This content is always visible. Click anywhere on the card to expand.</p>
            </div>
          </ExpandableCard.Content>
          <ExpandableCard.HiddenContent>
            <div className="px-6 pb-6 border-t border-gray-200">
              <h4 className="font-semibold mt-4 mb-2">Expanded Content</h4>
              <p className="text-gray-600 mb-2">This content is only visible when the card is expanded.</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Additional information</li>
                <li>More details</li>
                <li>Extra content that was hidden</li>
              </ul>
            </div>
          </ExpandableCard.HiddenContent>
        </>
      )}
    </ExpandableCard>
  ),
};

export const StartExpanded: ExpandableCardStory = {
  name: "Start expanded",
  args: {
    defaultOpen: true,
    shadow: "hard",
    border: true,
  },
  render: (args) => (
    <ExpandableCard {...args}>
      {({ open }) => (
        <>
          <ExpandableCard.Content>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Already Expanded</h3>
                <ExpandableCard.Chevron open={open} />
              </div>
              <p className="text-gray-600">This card starts in an expanded state. Click to collapse.</p>
            </div>
          </ExpandableCard.Content>
          <ExpandableCard.HiddenContent>
            <div className="px-6 pb-6 border-t border-gray-200">
              <h4 className="font-semibold mt-4 mb-2">Visible Content</h4>
              <p className="text-gray-600">This content is visible by default since the card starts expanded.</p>
            </div>
          </ExpandableCard.HiddenContent>
        </>
      )}
    </ExpandableCard>
  ),
};

export const NoExpandableContent: ExpandableCardStory = {
  name: "No expandable content",
  args: {
    shadow: "hard",
    border: true,
  },
  render: (args) => (
    <ExpandableCard {...args}>
      {({ open }) => (
        <>
          <ExpandableCard.Content>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Regular Card</h3>
              <p className="text-gray-600">When there's no HiddenContent, this behaves like a normal card without expand functionality.</p>
            </div>
          </ExpandableCard.Content>
        </>
      )}
    </ExpandableCard>
  ),
};

export const MultipleCards: ExpandableCardStory = {
  name: "Multiple expandable cards",
  args: {
    shadow: "hard",
    border: true,
  },
  render: (args) => (
    <div className="space-y-4">
      <ExpandableCard {...args}>
        {({ open }) => (
          <>
            <ExpandableCard.Content>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Card 1</h3>
                <p className="text-gray-600">First expandable card. Try expanding multiple cards to see the auto-scroll behavior.</p>
              </div>
            </ExpandableCard.Content>
            <ExpandableCard.HiddenContent>
              <div className="px-6 pb-6 border-t border-gray-200">
                <h4 className="font-semibold mt-4 mb-2">Details for Card 1</h4>
                <p className="text-gray-600">Extended information for the first card.</p>
              </div>
            </ExpandableCard.HiddenContent>
          </>
        )}
      </ExpandableCard>

      <ExpandableCard {...args}>
        {({ open }) => (
          <>
            <ExpandableCard.Content>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Card 2</h3>
                <p className="text-gray-600">Second expandable card with different content.</p>
              </div>
            </ExpandableCard.Content>
            <ExpandableCard.HiddenContent>
              <div className="px-6 pb-6 border-t border-gray-200">
                <h4 className="font-semibold mt-4 mb-2">Details for Card 2</h4>
                <p className="text-gray-600">Extended information for the second card.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">Additional nested content to demonstrate height transitions.</p>
                </div>
              </div>
            </ExpandableCard.HiddenContent>
          </>
        )}
      </ExpandableCard>

      <ExpandableCard {...args}>
        {({ open }) => (
          <>
            <ExpandableCard.Content>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2">Card 3</h3>
                <p className="text-gray-600">Third expandable card. Notice how collapsing scrolls the card into view.</p>
              </div>
            </ExpandableCard.Content>
            <ExpandableCard.HiddenContent>
              <div className="px-6 pb-6 border-t border-gray-200">
                <h4 className="font-semibold mt-4 mb-2">Details for Card 3</h4>
                <p className="text-gray-600">Extended information for the third card.</p>
              </div>
            </ExpandableCard.HiddenContent>
          </>
        )}
      </ExpandableCard>
    </div>
  ),
};
