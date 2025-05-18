import type { Preview } from "@storybook/nextjs";
import React, { useEffect } from "react";
import "@repo/design-system/styles";
import { DocsContainer as BaseDocsContainer } from "@storybook/addon-docs/blocks";

// Load theme CSS dynamically
const themeLoaders: Record<string, () => Promise<string>> = {
  "Volební kalkulačka (CZ)": async () =>
    // @ts-ignore
    await import("@repo/design-system/themes/www.volebnikalkulacka.cz/default"),
  "kalkulacka-one": async () =>
    // @ts-ignore
    (await import("!css-loader!@repo/design-system/themes/kalkulacka.one"))
      .default,
};

const keys = Object.keys(themeLoaders);

const loadTheme = async (themeName: string) => {
  const load = themeLoaders[themeName];
  if (!load) throw new Error(`Theme ${themeName} not found`);

  const oldStyle = document.getElementById("theme-style");
  if (oldStyle) oldStyle.remove();

  try {
    const cssContent = await load();
    const styleTag = document.createElement("style");
    styleTag.id = "theme-style";
    styleTag.textContent = cssContent;
    document.head.appendChild(styleTag);
    console.log("✅ Theme applied:", themeName);
  } catch (err) {
    console.error("❌ Failed to load theme:", themeName, err);
  }
};

// 👇 Your version, fixed
const ThemedDocsContainer = ({ children, context, ...props }) => {
  const theme = context?.store?.userGlobals?.globals?.theme;
  console.log("📦 DocsContainer context.globals.theme:", theme);

  useEffect(() => {
    if (theme) loadTheme(theme);
  }, [theme]);

  return (
    <BaseDocsContainer context={context} {...props}>
      {children}
    </BaseDocsContainer>
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
      const theme = context?.globals?.theme;
      useEffect(() => {
        if (theme) loadTheme(theme);
      }, [theme]);

      return <Story />;
    },
  ],
};

export default preview;
