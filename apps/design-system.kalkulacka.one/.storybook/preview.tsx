import { DocsContainer } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/nextjs';
import React, { useEffect } from 'react';
import '@repo/design-system/styles';

const themeLoaders: Record<string, () => Promise<string>> = {
  'kalkulacka-one': async () =>
    // @ts-ignore
    (await import('!css-loader!@repo/design-system/themes/kalkulacka.one')).default,
};


// Function to dynamically load CSS content using the Record
const loadTheme = (themeName: string) => {
  const load = themeLoaders[themeName];
  if (!load) throw new Error(`Theme ${themeName} not found`);
  return load();
const themeNames = Object.keys(themeLoaders);
};

const ThemedDocsContainer = ({ children, context, ...props }) => {
  const theme = context?.store?.userGlobals?.globals?.theme;

  useEffect(() => {
    const applyTheme = async () => {
      const oldStyle = document.getElementById('theme-style');
      if (oldStyle) oldStyle.remove();

      try {
        const cssContent = await loadTheme(theme);
        const styleTag = document.createElement('style');
        styleTag.id = 'theme-style';
        styleTag.textContent = cssContent;
        document.head.appendChild(styleTag);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    applyTheme();

    return () => {
      const oldStyle = document.getElementById('theme-style');
      if (oldStyle) oldStyle.remove();
    };
  }, [theme]);

  return (
    <DocsContainer context={context} {...props}>
      {children}
    </DocsContainer>
  );
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
    docs: {
      container: ThemedDocsContainer,
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: themeNames[0],
      toolbar: {
        icon: 'paintbrush',
        items: themeNames,
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;

      useEffect(() => {
        const applyTheme = async () => {
          const oldStyle = document.getElementById('theme-style');
          if (oldStyle) oldStyle.remove();

          try {
            const cssContent = await loadTheme(theme);
            const styleTag = document.createElement('style');
            styleTag.id = 'theme-style';
            styleTag.textContent = cssContent;
            document.head.appendChild(styleTag);
          } catch (error) {
            console.error('Error loading theme:', error);
          }
        };

        applyTheme();

        return () => {
          const oldStyle = document.getElementById('theme-style');
          if (oldStyle) oldStyle.remove();
        };
      }, [theme]);

      return <Story />;
    },
  ],
};

export default preview;
