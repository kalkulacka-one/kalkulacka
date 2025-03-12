import type { ThemeConfig } from 'tailwindcss/types/config';

const spacing: Pick<Partial<ThemeConfig>, 'spacing'> = {
	// We're adding these as a default spacing scale, but feel free to use any multiplies of 0.25rem as part of default Tailwind CSS spacing scale e.g. h-10 p-2
	spacing: {
		xxs: '0.25rem',
		xs: '0.5rem',
		sm: '1rem',
		md: '1.5rem',
		lg: '2rem',
		xl: '3rem',
	},
};

export default spacing;
