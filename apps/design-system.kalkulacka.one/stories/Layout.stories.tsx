import { Layout } from "@repo/design-system/server";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Layout> = {
  title: "Components/Layout",
  component: Layout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

type LayoutStory = StoryObj<typeof meta>;

export const Default: LayoutStory = {
  name: "Default layout",
  args: {
    children: (
      <>
        <Layout.Header>
          <div className="ko:bg-blue-100 ko:p-4 ko:text-center">Header Content</div>
        </Layout.Header>
        <Layout.Content>
          <div className="ko:bg-green-100 ko:p-4 ko:min-h-96">
            <h1 className="ko:text-2xl ko:font-bold ko:mb-4">Main Content</h1>
            <p>This is the main content area of the layout.</p>
          </div>
        </Layout.Content>
        <Layout.Footer>
          <div className="ko:bg-gray-100 ko:p-4 ko:text-center">Footer Content</div>
        </Layout.Footer>
      </>
    ),
  },
};

export const WithFixedHeader: LayoutStory = {
  name: "Layout with fixed header",
  args: {
    children: (
      <>
        <Layout.Header fixed>
          <div className="ko:bg-blue-100 ko:p-4 ko:text-center">Fixed Header</div>
        </Layout.Header>
        <Layout.Content>
          <div className="ko:bg-green-100 ko:p-4 ko:min-h-96">
            <h1 className="ko:text-2xl ko:font-bold ko:mb-4">Main Content</h1>
            <p>This layout has a fixed header that stays at the top when scrolling.</p>
            <div className="ko:h-96 ko:bg-yellow-100 ko:mt-4 ko:p-4">
              <p>Scroll down to see the fixed header behavior...</p>
            </div>
          </div>
        </Layout.Content>
        <Layout.Footer>
          <div className="ko:bg-gray-100 ko:p-4 ko:text-center">Footer Content</div>
        </Layout.Footer>
      </>
    ),
  },
};

export const FullWidthContent: LayoutStory = {
  name: "Layout with full width content",
  args: {
    children: (
      <>
        <Layout.Header>
          <div className="ko:bg-blue-100 ko:p-4 ko:text-center">Header</div>
        </Layout.Header>
        <Layout.Content fullWidth>
          <div className="ko:bg-green-100 ko:p-4 ko:min-h-96">
            <h1 className="ko:text-2xl ko:font-bold ko:mb-4">Full Width Content</h1>
            <p>This content takes the full width of the container.</p>
          </div>
        </Layout.Content>
        <Layout.Footer>
          <div className="ko:bg-gray-100 ko:p-4 ko:text-center">Footer</div>
        </Layout.Footer>
      </>
    ),
  },
};

export const WithBottomNavigation: LayoutStory = {
  name: "Layout with bottom navigation",
  args: {
    children: (
      <>
        <Layout.Header>
          <div className="ko:bg-blue-100 ko:p-4 ko:text-center">Header</div>
        </Layout.Header>
        <Layout.Content>
          <div className="ko:bg-green-100 ko:p-4 ko:min-h-96">
            <h1 className="ko:text-2xl ko:font-bold ko:mb-4">Content with Bottom Navigation</h1>
            <p>This layout includes a bottom navigation area.</p>
          </div>
        </Layout.Content>
        <Layout.BottomNavigation>
          <div className="ko:bg-purple-100 ko:p-4 ko:text-center ko:pointer-events-auto">Bottom Navigation</div>
        </Layout.BottomNavigation>
        <Layout.BottomSpacer className="ko:h-16" />
      </>
    ),
  },
};

export const CompleteLayout: LayoutStory = {
  name: "Complete layout with all components",
  args: {
    children: (
      <>
        <Layout.Header>
          <div className="ko:bg-blue-100 ko:p-4 ko:text-center">Header</div>
        </Layout.Header>
        <Layout.Content>
          <div className="ko:bg-green-100 ko:p-4 ko:min-h-96">
            <h1 className="ko:text-2xl ko:font-bold ko:mb-4">Complete Layout</h1>
            <p>This example shows all layout components working together:</p>
            <ul className="ko:list-disc ko:list-inside ko:mt-2">
              <li>Header at the top</li>
              <li>Main content area</li>
              <li>Bottom navigation</li>
              <li>Footer</li>
              <li>Bottom spacer for proper spacing</li>
            </ul>
          </div>
        </Layout.Content>
        <Layout.BottomNavigation>
          <div className="ko:bg-purple-100 ko:p-4 ko:text-center ko:pointer-events-auto">Bottom Navigation</div>
        </Layout.BottomNavigation>
        <Layout.Footer>
          <div className="ko:bg-gray-100 ko:p-2 ko:text-center ko:text-sm">Footer</div>
        </Layout.Footer>
        <Layout.BottomSpacer className="ko:h-20" />
      </>
    ),
  },
};

export default meta;
