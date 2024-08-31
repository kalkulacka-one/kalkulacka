import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "@repo/design-system/styles";

// Record to map theme names to their respective import functions
const themeLoaders: Record<string, () => Promise<string>> = {
  "theme-idnes": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/theme-idnes"))
      .default,
  "theme-default": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/theme-default"))
      .default,
};

const keys = Object.keys(themeLoaders);

// Function to dynamically load CSS content using the Record
const loadTheme = (themeName: string) => {
  const load = themeLoaders[themeName];
  if (!load) throw new Error(`Theme ${themeName} not found`);
  return load();
};

// Storybook preview configuration with globalTypes for themes
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: keys[0],
      toolbar: {
        icon: "circlehollow",
        items: keys,
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;

      useEffect(() => {
        const applyTheme = async () => {
          const oldStyle = document.getElementById("theme-style");
          if (oldStyle) oldStyle.remove();

          try {
            const cssContent = await loadTheme(theme);
            const styleTag = document.createElement("style");
            styleTag.id = "theme-style";
            styleTag.textContent = cssContent;
            document.head.appendChild(styleTag);
          } catch (error) {
            console.error("Error loading theme:", error);
          }
        };

        applyTheme();

        return () => {
          const oldStyle = document.getElementById("theme-style");
          if (oldStyle) oldStyle.remove();
        };
      }, [theme]);

      return <Story />;
    },
  ],
};

export default preview;
