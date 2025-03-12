import globalConfig from '@repo/design-system/tailwind';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'content' | 'presets' | 'prefix'> = {
  presets: [globalConfig],
  content: ['./app/**/*.tsx'],
  prefix: '', // design-system has k1- prefix. We might or might not use it in other projects. But it's better to not conflict with it.
};

export default config;
