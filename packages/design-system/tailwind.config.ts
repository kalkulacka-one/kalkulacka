import type { Config } from 'tailwindcss';
import borderRadius from './config/borderRadius';
import colors from './config/colors';
import spacing from './config/spacing';
import typography from './config/typography';

// Each package is responsible for its own content
const config: Config = {
	content: ['./src/**/*.tsx'],
	prefix: 'k1-',
	theme: {
		extend: {
			...colors,
			...typography,
			...spacing,
		},
		// Replace the default Tailwind CSS with our own
		...borderRadius,
	},
	plugins: [],
};

export default config;
