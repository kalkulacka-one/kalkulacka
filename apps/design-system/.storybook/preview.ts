import { type Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";

import "@repo/design-system/styles";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        default: "default",
        example: "example",
      },
      defaultTheme: "default",
    }),
  ],
};

export default preview;
