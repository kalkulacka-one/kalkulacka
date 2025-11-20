import { Avatar } from "@kalkulacka-one/design-system/server";

import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    alignment: {
      control: "select",
      options: ["center", "top"],
    },
    padding: {
      control: "boolean",
    },
    backgroundColor: {
      control: "color",
    },
  },
};

type AvatarStory = StoryObj<typeof meta>;

export const PersonWithImage: AvatarStory = {
  name: "Person with image",
  args: {
    shape: "circle",
    size: "medium",
    backgroundColor: "#ffffff",
    alignment: "center",
    image: {
      original: "https://i.pravatar.cc/300?img=12",
      md: "https://i.pravatar.cc/100?img=12",
      sm: "https://i.pravatar.cc/80?img=12",
    },
  },
};

export const OrganizationWithImage: AvatarStory = {
  name: "Organization with image",
  args: {
    shape: "square",
    size: "medium",
    backgroundColor: "#ffffff",
    image: {
      original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
    },
  },
};

export const Sizes: AvatarStory = {
  name: "Size variants",
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar
        shape="circle"
        size="small"
        backgroundColor="#ffffff"
        image={{
          original: "https://i.pravatar.cc/300?img=12",
          md: "https://i.pravatar.cc/100?img=12",
          sm: "https://i.pravatar.cc/80?img=12",
        }}
      />
      <Avatar
        shape="circle"
        size="medium"
        backgroundColor="#ffffff"
        image={{
          original: "https://i.pravatar.cc/300?img=12",
          md: "https://i.pravatar.cc/100?img=12",
          sm: "https://i.pravatar.cc/80?img=12",
        }}
      />
      <Avatar
        shape="circle"
        size="large"
        backgroundColor="#ffffff"
        image={{
          original: "https://i.pravatar.cc/300?img=12",
          md: "https://i.pravatar.cc/100?img=12",
          sm: "https://i.pravatar.cc/80?img=12",
        }}
      />
    </div>
  ),
};

export const CircleVsSquare: AvatarStory = {
  name: "Circle vs Square",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          shape="circle"
          size="large"
          backgroundColor="#ffffff"
          image={{
            original: "https://i.pravatar.cc/300?img=12",
            md: "https://i.pravatar.cc/100?img=12",
            sm: "https://i.pravatar.cc/80?img=12",
          }}
        />
        <span className="text-sm text-slate-600">Circle</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          shape="square"
          size="large"
          backgroundColor="#ffffff"
          image={{
            original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
          }}
        />
        <span className="text-sm text-slate-600">Square</span>
      </div>
    </div>
  ),
};

export const PortraitAlignment: AvatarStory = {
  name: "Portrait with top alignment",
  args: {
    shape: "circle",
    size: "medium",
    backgroundColor: "#ffffff",
    alignment: "top",
    image: {
      original: "https://i.pravatar.cc/300?img=12",
      md: "https://i.pravatar.cc/100?img=12",
      sm: "https://i.pravatar.cc/80?img=12",
    },
  },
};

export const WithPadding: AvatarStory = {
  name: "Organization logo with padding",
  args: {
    shape: "square",
    size: "medium",
    backgroundColor: "#ffffff",
    padding: true,
    image: {
      original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
    },
  },
};

export const PaddingComparison: AvatarStory = {
  name: "With vs without padding",
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          shape="square"
          size="large"
          backgroundColor="#ffffff"
          padding={false}
          image={{
            original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
          }}
        />
        <span className="text-sm text-slate-600">No padding</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar
          shape="square"
          size="large"
          backgroundColor="#ffffff"
          padding={true}
          image={{
            original: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/ODS_logo.svg/200px-ODS_logo.svg.png",
          }}
        />
        <span className="text-sm text-slate-600">With padding</span>
      </div>
    </div>
  ),
};

export default meta;
