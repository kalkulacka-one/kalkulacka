import fs from "node:fs";
import path from "node:path";

const THEMES: Record<string, string> = {
  kalkulacka: "www.volebnikalkulacka.cz/default.css",
  idnes: "www.volebnikalkulacka.cz/idnes.css",
};

const DEFAULT_THEME_KEY = "kalkulacka";

export const getThemeStyles = (themeName?: string): string => {
  const themeKey = themeName && THEMES[themeName] ? themeName : DEFAULT_THEME_KEY;
  const themeFile = THEMES[themeKey];

  if (!themeFile) {
    console.error(`❌ [ThemeProvider] Could not find a theme file for key: ${themeKey}`);
    return "";
  }

  try {
    const filePath = path.join(process.cwd(), "../..", "packages", "design-system", "src", "themes", themeFile);

    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error(`❌ [ThemeProvider] Failed to read theme file: ${themeFile}`, error);
    return "";
  }
};
