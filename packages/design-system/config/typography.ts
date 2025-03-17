import defaultTheme from 'tailwindcss/defaultTheme';
import type { ThemeConfig } from 'tailwindcss/types/config';

const typography: Pick<Partial<ThemeConfig>, 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing'> = {
  fontFamily: {
    sans: ['"Radio Canada"', ...defaultTheme.fontFamily.sans],
  },
};

export default typography;
