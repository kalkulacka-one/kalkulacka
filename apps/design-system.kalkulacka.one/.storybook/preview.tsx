import { IntlProvider } from "@repo/design-system/client";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/nextjs";
import React, { useEffect } from "react";
import { reactIntl } from "./reactIntl";
import "@repo/design-system/styles";

const themeLoaders: Record<string, () => Promise<string>> = {
  "Kalkulacka.1": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/www.kalkulacka.one/default")).default,
  "Volební kalkulačka (CZ)": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/www.volebnikalkulacka.cz/default")).default,
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
  initialGlobals: {
    locale: reactIntl.defaultLocale,
  },
  parameters: {
    reactIntl,
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
    locale: {
      name: "Locale",
      description: "Internationalization locale",
      defaultValue: reactIntl.defaultLocale,
      toolbar: {
        title: "Languaga",
        icon: "globe",
        items: reactIntl.locales.map((locale) => ({
          value: locale,
          title: locale.toUpperCase(),
        })),
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme;
      useTheme(themeName);

      return <Story />;
    },
    (Story, context) => {
      const { locale } = context.globals;
      const messages = reactIntl.messages[locale];

      return (
        <IntlProvider locale={locale} messages={messages}>
          <Story />
        </IntlProvider>
      );
    },
  ],
};

export default preview;
