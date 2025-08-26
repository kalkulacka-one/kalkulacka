import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/nextjs";
import React, { useEffect } from "react";
import "@repo/design-system/styles";

const themeLoaders: Record<string, () => Promise<string>> = {
  "Kalkulacka.1": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/www.kalkulacka.one/default")).default,
  "Volební kalkulačka (CZ)": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/www.volebnikalkulacka.cz/default")).default,
  "Volební kalkulačka (CZ) — Generace F": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/www.volebnikalkulacka.cz/generace-f")).default,
};

const themeNames = Object.keys(themeLoaders);

const applyTheme = async (themeName: string) => {
  const loader = themeLoaders[themeName];
  if (!loader) {
    throw new Error(`Theme \`${themeName}\` is not defined`);
  }

  const cssContent = await loader();
  if (!cssContent) {
    throw new Error(`Theme \`${themeName}\` is empty`);
  }

  const currentTheme = document.getElementById("theme-style");
  if (currentTheme) currentTheme.remove();

  const styleTag = document.createElement("style");
  styleTag.id = "theme-style";
  styleTag.textContent = cssContent;
  document.head.appendChild(styleTag);
};

const useTheme = (themeName: string) => {
  useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);
};

const ThemedDocsContainer = ({ children, context, ...props }) => {
  const themeName = context?.store?.userGlobals?.globals?.theme;
  useTheme(themeName);

  return (
    <DocsContainer context={context} {...props}>
      {children}
    </DocsContainer>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      container: ThemedDocsContainer,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "Volební kalkulačka (CZ)",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: themeNames,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme;
      useTheme(themeName);

      return <Story />;
    },
  ],
};

export default preview;
