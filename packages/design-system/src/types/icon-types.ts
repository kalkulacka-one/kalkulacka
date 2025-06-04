import * as Icons from "../components/server/icons";

export type IconType = keyof typeof Icons;

// A derived list of icon names used for tooling (e.g., Storybook dropdowns)
export const iconNames = Object.keys(Icons) as IconType[];
