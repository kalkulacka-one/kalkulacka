# Design system

This package contains design system for all Kalkulacka One projects.

## Exports

- `./tailwind` exports `tailwind.config.js` file as default export
- `./styles` exports compiled css file (compiled Tailwind CSS)
- `./themes/*` export all theme css files (inlcuding default theme)
- `/fonts` export public directory with all fonts used in the design system

Components should be exported per-category using a barrel index file from each directory in `/src`.

## Tailwind configuration

- We define all config in `tailwind.config.js` file. Which is a base configuration for all projects using Tailwind CSS in their implementation. Each project is required to override `content` for their own tailwind files and `prefix` to avoid conflict with the design-system classes.
- We use specific theme configuration in `/config` directory. e.g. `colors`, `typography`. To add new theme overrides, add a new file, properly type it using `Pick<Partial<ThemeConfig>, "XYZ">` and import in `tailwind.config.js` file.

## Theming

We use css variables as a theming solution. Currently they are in `/src/themes` directory, but this is a subject to change.

- We have a default file `theme-default.css` which is a base theme for all projects.
- For each theme we can have an override file, e.g. `theme-idnes.css` that can re-define some of the variables or add their own custom css.

For each project, we need to import the default theme and then import the specific theme, if one is selected.

## Colors

We use base paletter for `primary`, `secondary` and `neutral` colors defined as css variables in Theme files. Then in Tailwind config we define semantic colors like `text-primary`, `bg-primary`, `border-primary` etc. which are used in components.

Each semantic color should be defined using reference to the palette variable, e.g. `secondaryColors[70]` for solic colors or `` `rgb(from ${neutralColors[100]} r g b / 0.8)` ``

All colors are defined in [config/colors.ts](src/config/colors.ts) file.
